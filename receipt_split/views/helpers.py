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
    return user.username


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
        s = Settlement.query.get({
            "from_user_id": owner.id,
            "to_user_id": u.id
        })
        if s is not None:
            s.update_settlement()

        s = Settlement.query.get({
            "from_user_id": u.id,
            "to_user_id": owner.id
        })
        if s is not None:
            s.update_settlement()

        app.logger.debug("\tsettlement uid %s", u.id)
        app.logger.debug("\tsettlement %s", s)


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

    owner_in_users = False

    def is_owner(u_id, owner_id):
        global owner_in_users
        if u_id == owner_id:
            owner_in_users = True
            return True
        return False

    balances = [
        Balance(
            to_user=owner,
            from_user=u,
            amount=balance_dict.get(get_userkey(u), Decimal(0)),
            paid=is_owner(u.id, owner.id)  # set paid if owner is paying owner
        ) for u in users]

    receipt.balances = balances

    update_settlements(receipt)

    user_list = users if owner_in_users else [owner] + users
    for u in user_list:
        pay_balances(u)

    return receipt


def pay_balances(user):
    # balances user must pay, older dates first
    balances = Balance.query.filter(
        and_(
            and_(
                Balance.to_user_id != user.id,  # no self addressed
                Balance.from_user_id == user.id,  # balances user must pay
            ),
            Balance.paid.is_(False)  # only get unpaid balances
        )
    ).order_by(Balance.created_on).all()

    app.logger.debug("Balances pay_balances %s", balances)

    settlement_dict = {}

    for balance in balances:
        # if already got settlement, fetch it from dict,
        # else get it and save it
        key = f"{user.id}-{balance.to_user_id}"
        set_fetch = settlement_dict.get(key)

        settlement = Settlement.query.get({
                        "from_user_id": user.id,
                        "to_user_id": balance.to_user_id,
                     }) if set_fetch is None else set_fetch

        app.logger.debug("pay_balances key %s", key)
        app.logger.debug("pay_balances diffamount %s",
                         settlement.diff_amount)
        app.logger.debug("pay_balances balanceamount %s",
                         balance.amount)

        # less than amount paid
        if balance.amount <= settlement.paid_amount:
            app.logger.debug("Paid!")
            settlement.apply_balance(balance)
            app.logger.debug("before balance %s , paid %s", balance,
                             balance.paid)
            balance.paid = True
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
