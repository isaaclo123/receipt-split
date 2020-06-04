from decimal import Decimal


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
    return str(user.get("id", "-1")) + " - " + user.get("username", " ")


def calculate_balances(receipt):
    """
    takes python serializer dict and calculates balances
    """
    owner = receipt.get("user")
    users = receipt.get("users")
    total_amount = receipt.get("amount")
    receipt_items = receipt.get("receipt_items", [])

    # error check
    if owner is None or users is None or total_amount is None:
        return None

    print("USER NOT NONE")

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

    print("           num_users")
    print(users)
    print("           balancesuser")

    amount_dict = {
        get_userkey(u): (Decimal(total_without_subitems) / num_users)
        for u in users
    }

    print("           I in receipt items before balancesuser")
    print(users)
    print("           balancesuser")

    for i in receipt_items:
        print("RECIEPT ITEM")
        print(i)
        subtotal = i.get("amount", 0)
        i_users = i.get("users", [])
        len_users = len(i_users)

        if len_users <= 0 or subtotal <= 0:
            continue
            # i_users = users
            # len_users = num_users

        amount = (Decimal(subtotal) / len_users)
        print("AMOUNTAMOUNTNASDhlafdskjdfhasfjsafdsadfdsafdsa" + str(amount))
        print("             " + str(amount))
        print("AMOUNTAMOUNTNASDhlafdskjdfhasfjsafdsadfdsafdsa" + str(amount))

        amount_dict[owner_userkey] = amount_dict[owner_userkey] - subtotal
        for u in i_users:
            userkey = get_userkey(u)
            amount_dict[userkey] = amount_dict[userkey] + amount
            # amount_dict[] = amount_dict[userkey] + amount

    print("           balancesuser")
    print(users)
    print("           balancesuser")

    balances = [{
        "to_user": owner,
        "from_user": u,
        "amount": amount_dict.get(get_userkey(u), 0)
    } for u in users]

    print("           balances")
    print(balances)
    print("           balances")

    return balances
