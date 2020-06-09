from decimal import Decimal
import math


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
    return user.get("username", "")


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
    owner = receipt.get("user")
    users = receipt.get("users", [])
    receipt_amount = Decimal(receipt.get("amount"))
    receipt_items = receipt.get("receipt_items", [])

    # error check
    if owner is None or users is None or receipt_amount is None:
        return None

    if (len(users) <= 0):
        return [{
            "to_user": owner,
            "from_user": owner,
            "amount": receipt_amount
        }]

    # subtotals = sum([i.get("amount", 0.0) for i in receipt_items])
    subitem_total = Decimal(0)

    balance_dict = {
        get_userkey(u): Decimal(0)
        for u in users
    }

    # split for receipt_items
    for r in receipt_items:
        subitem_amount = Decimal(r.get("amount", 0))
        subitem_users = r.get("users", [])

        subitem_total = subitem_total + subitem_amount

        # split costs
        split_cost(subitem_amount, subitem_users, owner, balance_dict)

    # split cost evenly not in receipt_items
    non_subitem_amount = receipt_amount - subitem_total

    if (non_subitem_amount < 0):
        return None

    split_cost(non_subitem_amount, users, owner, balance_dict)

    balances = [{
        "to_user": owner,
        "from_user": u,
        "amount": balance_dict.get(get_userkey(u), Decimal(0))
    } for u in users]

    return balances
