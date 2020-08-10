from decimal import Decimal
from flask import request
from flask import current_app as app
from flask_api import status
from flask_jwt import current_identity
from functools import reduce
from dataclasses import dataclass, field
from typing import Any, List, Dict, Callable
import math
from sqlalchemy import and_

from receipt_split.meta import db
from receipt_split.models import Balance, Settlement
from . import err


def get_userkey(user):
    # return str(user.get("id", "-1")) + " - " + user.get("username", " ")
    return user.id


def get(x, *args):
    default = None if (not args) else args[0]
    return default if x is None else x


def round_decimals_down(number: Decimal, decimals: int = 2):
    """
    https://kodify.net/python/math/round-decimals/#round-decimal-places-down-in-python
    Returns a value rounded down to a specific number of decimal places.
    """
    if not isinstance(decimals, int):
        raise TypeError("decimal places must be an integer")
    elif decimals < 0:
        raise ValueError("decimal places has to be 0 or more")
    elif decimals == 0:
        return math.ceil(number)

    factor = 10 ** decimals
    return Decimal(math.floor(number * factor)) / factor


def split_cost(subitem_amount, subitem_users, owner, balance_dict):
    if len(subitem_users) <= 0 or subitem_amount <= 0:
        return

    split_amount = round_decimals_down(subitem_amount / len(subitem_users), 2)
    split_remainder = subitem_amount - len(subitem_users) * split_amount

    # split amongst users in balance_dict
    for u in subitem_users:
        userkey = get_userkey(u)
        balance_dict[userkey] = (balance_dict.get(userkey, Decimal(0)) +
                                 split_amount)

    # give owner remainder of split
    owner_userkey = get_userkey(u)
    balance_dict[owner_userkey] = (balance_dict.get(owner_userkey,
                                                    Decimal(0)) +
                                   split_remainder)


def get_new_balances(old_balances, new_balance_dict, owner_id):
    paid_balances = {}
    paid_balance_list = []
    new_balances = []
    # deleted_users = {}  # paid and deleted user
    deleted_list = []  # paid and deleted user

    app.logger.debug("old_balances %s", old_balances)
    app.logger.debug("new_balance_dict %s", new_balance_dict)
    app.logger.debug("owner_id %s", owner_id)
    app.logger.debug("old-------")

    # def set_dict(b):
    #     val = paid_balances.get(b.from_user_id, {}).get(b.to_user_id)
    #     opp_val = paid_balances.get(b.to_user_id, {}).get(b.from_user_id)

    #     if val is None and opp_val is None:
    #         paid_balances.setdefault(
    #             b.from_user_id, {
    #                 b.to_user_id: b.amount
    #             })
    #     elif val is not None:
    #         paid_balances[b.from_user_id][b.to_user_id] += b.amount
    #     else:  # opp_val is None
    #         paid_balances[b.to_user_id][b.from_user_id] -= b.amount

    # get old paid balances to consider
    for b in old_balances:
        if b.paid and not b.is_to_and_from_owner:  # to/from owner already ok
            # if user not in new balances, they were deleted
            # this indicates that a user was in old balances and paid, but is
            # now deleted
            if b.from_user_id not in new_balance_dict or \
                    b.to_user_id not in new_balance_dict:
                # deleted_users[b.to_user_id] = True
                deleted_list += [b]

            # if b.from_user_id not in new_balance_dict or b.to_user_id not in\
            #         new_balance_dict:
            #     app.logger.debug("User has been removed")
            #     continue
            val = paid_balances.get(b.from_user_id, {}).get(b.to_user_id)
            opp_val = paid_balances.get(b.to_user_id, {}).get(b.from_user_id)

            if val is None and opp_val is None:
                paid_balances.setdefault(
                    b.from_user_id, {
                        b.to_user_id: b.amount
                    })
            elif val is not None:
                paid_balances[b.from_user_id][b.to_user_id] += b.amount
            else:  # opp_val is None
                paid_balances[b.to_user_id][b.from_user_id] -= b.amount

            paid_balance_list += [b]

    app.logger.debug("paid balance list %s", paid_balance_list)

    # new_balance dict is keys is from_user -> owner to_user

    for from_user, to_users in paid_balances.items():
        for to_user, amount in to_users.items():
            old_amount = Decimal(0)
            payer = None
            payee = owner_id

            if from_user == owner_id:
                # paid balance is something owner must pay.
                # new_balances always from a -> owner
                old_amount = -1 * amount
                payer = to_user
            elif to_user == owner_id:
                old_amount = amount
                payer = from_user
            else:
                continue

            # paid_amount and new_amount represent how much
            # from payer -> to payee
            # TODO
            new_amount = Decimal(0)

            if payer not in new_balance_dict:
                # deleted user
                app.logger.debug("deleted user %s", payer)
                continue
            else:
                new_amount = new_balance_dict[payer]

            # TODO
            diff_amount = new_amount - old_amount
            app.logger.debug("diff amount %s", diff_amount)

            if diff_amount < 0:
                payee = payer
                payer = owner_id
                # turn amount positive, as we flip payee and payer
                diff_amount *= -1
            if diff_amount == 0:
                # empty balance, so remove balance
                continue

            new_balances += [
                Balance(
                    from_user_id=payer,
                    to_user_id=payee,
                    amount=diff_amount
                )
            ]

    # add new unpaid balances
    for from_user, amount in new_balance_dict.items():
        val = paid_balances.get(from_user, {}).get(owner_id)
        opp_val = paid_balances.get(owner_id, {}).get(from_user)
        # check to see balance not in paid_balances
        if val is None and opp_val is None:
            new_balances += [
                Balance(
                    from_user_id=from_user,
                    to_user_id=owner_id,
                    amount=amount
                )
            ]

    new_deleted_list = []
    for b in deleted_list:
        val = paid_balances.get(b.from_user, {}).get(b.to_user)
        if val is None:  # if deleted balance is unpaid paid
            new_deleted_list += [
                # create equal and opposite balance for the deleted user
                Balance(
                    from_user_id=b.to_user_id,
                    to_user_id=b.from_user_id,
                    amount=b.amount
                )
            ]

    app.logger.debug("=-------------GET new balances --------")
    app.logger.debug("new balances %s", new_balances)
    app.logger.debug("paid balances dict %s", paid_balances)
    app.logger.debug("paid balances %s", paid_balance_list)

    new_balances = paid_balance_list + new_balances + new_deleted_list

    return new_balances


def update_settlements(receipt):
    owner = get(receipt.user)
    users = get(receipt.users)

    # error check
    if owner is None:
        raise TypeError("owner user is null!")
    if users is None:
        raise TypeError("receipt users is null!")

    # update all settlements
    # TODO
    for u in users:
        s = Settlement.get(
            owner.id,
            u.id
        )
        if s is not None:
            s.update_settlement()

        app.logger.debug("\tsettlement uid %s", u.id)
        app.logger.debug("\tsettlement %s", s)


def reapply_balances(receipt, delete=True):
    """
    reapply balances before receipt delete
    """
    owner = get(receipt.user)
    balances = get(receipt.balances, [])

    for b in balances:
        # ignore self-addressed balances
        if not b.is_to_and_from_owner:
            s = Settlement.get(b.from_user_id, owner.id)
            # this is the settlement paying the owner of receipt

            # if paid, add balance back to original user
            # add back balance before delete receipt if paid
            if s.add_balance_back(b):
                app.logger.debug("\treapply balances %s from %s to %s", b,
                                 b.from_user, b.to_user)

    for b in balances:
        pay_balances(b.from_user)

        if delete:
            db.session.delete(b)


def calculate_balances(receipt):
    """
    takes receipt model object and calculate balances
    """
    owner = get(receipt.user)
    users = get(receipt.users)
    receipt_amount = get(receipt.amount)
    receipt_items = get(receipt.receipt_items)

    # error check
    if owner is None:
        raise TypeError("owner user is null!")
    if users is None:
        raise TypeError("receipt users is null!")
    if receipt_amount is None:
        raise TypeError("receipt amount is null!")

    if (len(users) <= 0):
        receipt.balances = [
            Balance(
                to_user=owner,
                from_user=owner,
                amount=receipt_amount
            )
        ]

    # subtotals = sum([i.get("amount", 0.0) for i in receipt_items])
    subitem_total = Decimal(0)

    balance_dict = {
        get_userkey(u): Decimal(0)
        for u in users
    }

    # split for receipt_items
    for r in receipt_items:
        subitem_amount = Decimal(get(r.amount, 0))
        subitem_users = get(r.users, [])

        subitem_total = subitem_total + subitem_amount

        # split costs
        split_cost(subitem_amount, subitem_users, owner, balance_dict)

    # split cost evenly not in receipt_items
    non_subitem_amount = receipt_amount - subitem_total

    if (non_subitem_amount < 0):
        st_dec = round_decimals_down(subitem_total)
        ra_dec = round_decimals_down(receipt_amount)
        s_error = (f"Total of subitems (${st_dec}) is greater than"
                   f" Receipt total (${ra_dec})")
        raise ValueError(s_error)

    split_cost(non_subitem_amount, users, owner, balance_dict)

    # Delete old balances
    # Balance.query.filter_by(receipt_id=receipt.id).delete()

    def is_owner(u_id, owner_id):
        global owner_in_users
        if u_id == owner_id:
            owner_in_users = True
            return True
        return False

    # new_balances = [
    #     Balance(
    #         to_user=owner,
    #         from_user=u,
    #         amount=balance_dict.get(get_userkey(u), Decimal(0)),
    #         paid=is_owner(u.id, owner.id)  # set paid if owner is paying
    # owner
    #     ) for u in users]

    new_balances = get_new_balances(receipt.balances, balance_dict, owner.id)

    receipt.balances = new_balances

    # TODO dont think i need this
    update_settlements(receipt)

    for u in users:
        if u.id != owner.id:
            # we will pay owner always, so skip owner
            pay_balances(u)

    pay_balances(owner)

    return receipt


def pay_balances(user):
    # balances user must pay, older dates first
    balances = Balance.query.filter(
        Balance.to_user_id != user.id,  # no self addressed
        Balance.from_user_id == user.id,  # balances user must pay
        Balance.paid.is_(False)  # only get unpaid balances
    ).order_by(Balance.created_on).all()

    app.logger.debug("Balances pay_balances %s", balances)

    settlement_dict = {}

    for balance in balances:
        # if already got settlement, fetch it from dict,
        # else get it and save it
        key = f"{user.id}-{balance.to_user_id}"
        set_fetch = settlement_dict.get(key)

        settlement = Settlement.get(
                        user.id,
                        balance.to_user_id,
                     ) if set_fetch is None else set_fetch

        app.logger.debug("pay_balances key %s", key)
        app.logger.debug("pay_balances diffamount %s",
                         settlement.diff_amount)
        app.logger.debug("pay_balances balanceamount %s",
                         balance.amount)

        if settlement.apply_balance(balance):
            app.logger.debug("Paid!")
        else:
            app.logger.debug("NOT Paid Error!")

        app.logger.debug("before balance %s , paid %s", balance,
                         balance.paid)
        app.logger.debug("after balance %s , paid %s", balance,
                         balance.paid)

        if set_fetch is None:
            settlement_dict[key] = settlement


def get_model_view(obj=None, schema=None):
    if obj is None:
        return err("requested data does not exist"), status.HTTP_404_NOT_FOUND

    return schema.dump(obj)


def accept_reject_view(action,

                       obj=None,
                       schema=None,

                       on_success=lambda x: None,
                       on_fail=lambda x: None,

                       # model=None,
                       accept="accept",
                       reject="reject"):
    if schema is None:
        raise TypeError("Schema Model argument is None")
    if obj is None:
        return err("Resource does not exist"), status.HTTP_404_NOT_FOUND
    # obj = model.query.get(id)

    # accept or reject bahavior after
    if action is None:
        return err("No action was given"), status.HTTP_400_BAD_REQUEST,

    if (action == accept or action == reject) and \
            request.method == 'POST':
        if action == accept:
            if obj.accept():
                db.session.commit()

        if action == reject:
            if obj.reject():
                db.session.commit()

        # continue
        return None

    return err("Should not get here"), status.HTTP_500_INTERNAL_SERVER_ERROR


def is_authorized(allowed_attrs, obj=None, **kwargs):
    if current_identity is None:
        return err("Requesting User invalid"),
    status.HTTP_500_INTERNAL_SERVER_ERROR

    authorized = reduce(
        # if one True attr, then all True
        lambda acc, cur:
            acc or (getattr(obj, cur) == current_identity),
        allowed_attrs,
        False  # default: user is not authorized to access
    )

    app.logger.debug("%s for %s authorized status %s",
                     current_identity.username, obj, authorized)

    if not authorized:
        return err("Not Authorized to access"), status.HTTP_401_UNAUTHORIZED

    return None


@dataclass
class Call:
    func: Callable[[Any], Any]
    args: List[Any] = field(default_factory=list)
    kwargs: Dict[Any, Any] = field(default_factory=dict)


@dataclass
class View:
    methods: List[str]
    # accepts list of functions that return null on success, otherwise, result
    # to return
    # passes "obj" into check function
    calls: List[Call] = field(default_factory=list)


def create_view(behaviors,
                *args,
                obj=None,
                no_obj=False,
                schema=None):
    if obj is None and not no_obj:
        return err("requested data does not exist"), status.HTTP_404_NOT_FOUND

    app.logger.debug("request.method %s", request.method)

    app.logger.debug("behaviors %s, len %s", behaviors, len(behaviors))
    for b in behaviors:
        app.logger.debug("b.method %s", b.methods)
        if request.method not in b.methods:
            continue

        app.logger.debug("after break")

        default_kwargs = {
            "obj": obj,
            "schema": schema
        }

        for c in b.calls:
            new_kwargs = {
                **default_kwargs,
                **c.kwargs
            }
            app.logger.debug("new_kwargs %s", new_kwargs)
            app.logger.debug("c.args %s", c.args)
            app.logger.debug("c.kwargs %s", c.kwargs)

            result = c.func(*args, *c.args, **new_kwargs)
            if result is not None:
                return result

    return err("Method not Allowed"), status.HTTP_405_METHOD_NOT_ALLOWED
