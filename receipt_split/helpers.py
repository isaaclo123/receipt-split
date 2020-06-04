from decimal import Decimal


def err(msg):
    """Returns error data
    :msg: msg to send
    :returns: Python dict containind error formatted string

    """
    return {"error": msg}


def ok(msg):
    """Returns ok data
    :msg: msg to send OK
    :returns: Python dict containind error formatted string

    """
    return {"ok": msg}


def get_userkey(user):
    return str(user.id) + " - " + str(user.username)


def calculate_balances(receipt):
    """
    takes python serializer dict and calculates balances
    """
    owner = receipt.user
    users = receipt.users
    total_amount = receipt.amount
    receipt_items = receipt.receipt_items

    # error check
    if owner is None or users is None or total_amount is None:
        return None

    owner_userkey = get_userkey(owner)

    num_users = len(users)

    if (num_users <= 0):
        return [{
            "to_user": owner,
            "from_user": owner,
            "amount": total_amount
        }]

    # subtotals = sum([i.get("amount", 0.0) for i in receipt_items])
    total_without_subitems = total_amount

    amount_dict = {
        get_userkey(u): (Decimal(total_without_subitems) / num_users)
        for u in users
    }

    for i in receipt_items:
        subtotal = i.amount
        i_users = i.users
        len_users = len(i_users)

        if len_users <= 0 or subtotal <= 0:
            continue
            # i_users = users
            # len_users = num_users

        amount = (Decimal(subtotal) / len_users)

        amount_dict[owner_userkey] = amount_dict[owner_userkey] - subtotal
        for u in i_users:
            userkey = get_userkey(u)
            amount_dict[userkey] = amount_dict[userkey] + amount
            # amount_dict[] = amount_dict[userkey] + amount

    balances = [{
        "to_user": owner,
        "from_user": u,
        "amount": amount_dict.get(get_userkey(u), 0)
    } for u in users]

    return balances
