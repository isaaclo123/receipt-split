from decimal import Decimal
import math
import operator
from flask import current_app as app
from flask_jwt import current_identity, jwt_required
from functools import reduce
from collections import OrderedDict

from sqlalchemy.sql import func, select
from sqlalchemy import literal_column

from receipt_split.schemas import balance_sum_schema
from receipt_split.models import Balance, Settlement, User, Payment
from receipt_split.meta import db
from sqlalchemy import and_
from . import views


def get_data(current_identity):
    id = current_identity.id
    balance_owned = []
    balance_owed = []
    for s in current_identity.settlements:
        owed_amount = s.get_owed_amount(id)
        paid_amount = s.get_paid_amount(id)

        app.logger.debug("    SETTLE paid %s", paid_amount)
        app.logger.debug("    SETTLE owed %s", owed_amount)

        to_add = {
            "user": User.query.get(s.get_other_user_id(id)),
            "balances": [],
            "owed_amount": owed_amount,
            "paid_amount": paid_amount,
        }

        if to_add.get("owed_amount") == paid_amount:
            continue

        if to_add.get("owed_amount") > paid_amount:
            to_add["balances"] = s.get_balances_to_pay(
                current_identity.id
            )

            balance_owned.append(to_add)
        else:
            to_add["owed_amount"] = -1 * owed_amount
            to_add["paid_amount"] = -1 * paid_amount

            to_add["balances"] = s.get_balances_owed(
                current_identity.id
            )

            balance_owed.append(to_add)

    balances_owned_dump = balance_sum_schema.dump(balance_owned)
    balances_owed_dump = balance_sum_schema.dump(balance_owed)

    return (balances_owned_dump, balances_owed_dump)


@views.route('/balancesums', methods=['GET'])
@jwt_required()
def balance_sums():
    # balances_owned = get_balances_owned(current_identity)
    # balances_owed = get_balances_owed(current_identity)
    data = get_data(current_identity)

    get_data(current_identity)

    result = {
        "balances_owned": data[0],
        # "balances_owed": balances_owed,
        "balances_owed": data[1],
    }

    app.logger.debug("balancesums result %s", result)

    return result
