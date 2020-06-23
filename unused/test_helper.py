
from decimal import Decimal
from flask import request
from flask import current_app as app
from flask_api import status
from functools import reduce
from dataclasses import dataclass, field
from typing import Any, List, Dict, Callable
from flask_jwt import current_identity
from pprint import pformat
import math
from functools import partial

from .meta import db
from .models import Balance, Settlement


def ok(msg):
    """OK message

    :msg: TODO
    :returns: TODO

    """
    return {"message": str(msg)}


def err(msg):
    """Error message

    :msg: TODO
    :returns: TODO

    """
    return {"error": str(msg)}


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


def calculate_balances(receipt):
    """
    takes python serializer dict and calculates balances
    """
    owner = get(receipt.user)
    users = get(receipt.users)
    receipt_amount = get(receipt.amount)
    receipt_items = get(receipt.receipt_items)

    # error check
    if owner is None:
        raise TypeError("owner user is null!")
    if users is None:
        raise TypeError("owner user is null!")
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

    balances = [
        Balance(
            to_user=owner,
            from_user=u,
            amount=balance_dict.get(get_userkey(u), Decimal(0)),
            paid=(u.id == owner.id)  # set paid if owner is paying owner
        ) for u in users]

    receipt.balances = balances

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

    return receipt


def get_model_view(schema=None):
    outer_schema = schema

    def wrapper(obj=None, schema=None,
                callback=lambda *x, **xx: None, *args, **kwargs):
        if obj is None:
            return err("requested data does not exist"),
        status.HTTP_404_NOT_FOUND

        if outer_schema is not None:
            return outer_schema.dump(obj)
        return schema.dump(obj)

    return wrapper


def accept_reject_view(action=None,
                       # model=None,
                       accept="accept",
                       reject="reject"):
    if schema is None:
        raise TypeError("Schema Model argument is None")
    if obj is None:
        raise TypeError("Object is None")

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

        obj_dump = schema.dump(obj)
        app.logger.debug("obj_dump %s", obj)
        return obj_dump

    return err("Should not get here"), status.HTTP_500_INTERNAL_SERVER_ERROR


def is_authorized(allowed_attrs=[]):
    # requires obj and optionall callback
    def wrapper(obj=None, callback=lambda *x, **xx: None,
                *args, **kwargs):
        if obj is None:
            return err("No Object for Comparison Found"),
        status.HTTP_500_INTERNAL_SERVER_ERROR

        if current_identity is None:
            return err("User Invalid"), status.HTTP_401_UNAUTHORIZED

        authorized = reduce(
            # if one True attr, then all True
            lambda acc, cur:
                acc or (getattr(obj, cur) == current_identity),
            allowed_attrs,
            True  # default: user is authorized to access
        )

        app.logger.debug("%s for %s authorized status %s",
                         current_identity.username, obj, authorized)

        if authorized:
            # return function that takes callback to next function
            return partial(callback, *args, obj=obj, **kwargs)

        return err("Unauthorized"), status.HTTP_401_UNAUTHORIZED

    return wrapper


@dataclass
class View:
    view: Callable[[Any], Any]
    methods: List[str]
    view_args: List[Any] = field(default_factory=list)
    view_kwargs: Dict[Any, Any] = field(default_factory=dict)
    # accepts list of functions that return true or false
    # passes "obj" into check function
    checks: List[Any] = field(default_factory=list)


"""
[{
    "methods": ["GET", ...]
    "auth_use_id": False
            #(Usually use current_identity compare, otherwise curr.id)
    "view": view((...args), ...view_args, obj=obj,
                    , ...view_kwargs)
    "view_args": []
    "view_kwargs": \{\}
        # function that does view
        # obj and current_identity passed in by default
}, ...]
"""


def create_view(behaviors,
                *args,
                obj=None,
                schema=None):

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

        if b.auth_attrs is None or \
                not is_authorized(b.auth_attrs, **default_kwargs):
            return err("Not Authorized"), status.HTTP_401_UNAUTHORIZED

        new_kwargs = {**default_kwargs, **b.view_kwargs}

        # pass original args, then view_args, then kwargs
        result = b.view(*args, *b.view_args, **new_kwargs)
        app.logger.debug("view result - %s", pformat(result))
        return result

    return err("Method not Allowed"), status.HTTP_405_METHOD_NOT_ALLOWED