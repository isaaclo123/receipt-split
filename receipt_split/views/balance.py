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


# def get_balance_list(q):
#     def find_balances(acc, cur):
#         user, balance, owed_amount, paid_amount = cur
#         newbalance = [] if balance is None else [balance]
#         acc[user.id] = {
#             "user": user,
#             "balances": acc.get(user.id, {}).get("balances", []) + newbalance,
#             "owed_amount": owed_amount,
#             "paid_amount": paid_amount,
#         }
#         return acc
#
#     balances = list(reduce(find_balances, q, OrderedDict()).values())
#     balances_dump = balance_sum_schema.dump(balances)
#     return balances_dump
#
#
# def get_balances_owned(current_identity):
#     # balances curr user must pay
#     app.logger.debug("OWNED------START")
#
#     # balance: FROM pays TO
#
#     # balances addressed to curr user, so curr user must pay it
#     # this returns id of user issuing balances to curr user
#     balance_ids_q = db.session.query(
#         Balance.from_user_id,
#     ).filter(
#         Balance.from_user_id == current_identity.id,
#         Balance.to_user_id != current_identity.id,
#         Balance.paid.is_(False)
#     )
#     balance_ids = balance_ids_q.subquery()
#     app.logger.debug("owned balances_ids %s", balance_ids_q.all())
#
#     # settlements curr user owes to others for balances above
#     settlements_ids_q = db.session.query(
#         Settlement.from_user_id,
#         Settlement.to_user_id,
#         Settlement.owed_amount,
#         Settlement.paid_amount
#     ).filter(
#         Settlement.from_user_id == current_identity.id,
#         # Settlement.owed_amount > Settlement.paid_amount
#         Settlement.from_user_id.in_(balance_ids)  # from others
#     )
#     settlements_ids = settlements_ids_q.subquery()
#     app.logger.debug("owned settlements_ids %s", settlements_ids_q.all())
#
#     q = db.session.query(
#         User,
#         Balance,
#         settlements_ids.c.owed_amount,
#         settlements_ids.c.paid_amount
#     ).select_from(
#         settlements_ids
#     ).join(  # get uer balance is from
#         User,
#         User.id == settlements_ids.c.to_user_id,
#     ).join(  # balances addressed to current user, must be paid my curr
#         Balance,
#         and_(
#             Balance.paid.is_(False),
#             Balance.to_user_id == User.id,
#             Balance.from_user_id == current_identity.id,
#         ),
#     )
#     app.logger.debug("q %s", q.all())
#
#     app.logger.debug("OWNED------END")
#
#     return get_balance_list(q.all())
#
#
# def get_balances_owed(current_identity):
#     # balance ids for
#     # balances not from current user
#     # balances are given to current user
#     # aka balances current user has to pay
#     app.logger.debug("OWED------START")
#
#     # balance: FROM pays TO
#
#     # balances addressed from curr user, so other user must pay it
#     # this returns id of balances owed to curr user
#     balance_ids_q = db.session.query(
#         Balance.from_user_id,
#     ).filter(
#         Balance.from_user_id != current_identity.id,  # from is payer
#         Balance.to_user_id == current_identity.id,  # to is paid
#         Balance.paid.is_(False)
#     )
#     balance_ids = balance_ids_q.subquery()
#     app.logger.debug("owed balances_ids %s", balance_ids_q.all())
#
#     # settlements curr user owes to others for balances above
#     settlements_ids_q = db.session.query(
#         Settlement.from_user_id,
#         Settlement.to_user_id,
#         Settlement.owed_amount,
#         Settlement.paid_amount,
#     ).filter(
#         Settlement.to_user_id == current_identity.id,  # to me
#         Settlement.from_user_id.in_(balance_ids)  # from others
#         # Settlement.owed_amount < Settlement.paid_amount
#     )
#     settlements_ids = settlements_ids_q.subquery()
#     app.logger.debug("owed settlements_ids %s", settlements_ids_q.all())
#
#     q = db.session.query(
#         User,
#         Balance,
#         settlements_ids.c.owed_amount,
#         settlements_ids.c.paid_amount
#     ).select_from(
#         settlements_ids
#     ).join(  # get user that Balance is from, the user curr user must pay
#         User,
#         User.id == settlements_ids.c.from_user_id,
#     ).join(  # balances addressed to current user, must be paid my curr
#         Balance,
#         and_(
#             Balance.paid.is_(False),
#             Balance.from_user_id == User.id,
#             Balance.to_user_id == current_identity.id,
#         ),
#     )
#     app.logger.debug("q %s", q.all())
#
#     app.logger.debug("OWED------END")
#
#     return get_balance_list(q)


def get_data_list(q):
    def get_result(acc, cur):
        user, balance_amount, paid_amount = cur
        # newbalance = [] if balance is None else [balance]
        newbalance = []
        if balance_amount > paid_amount:
            acc[0][user.id] = {
                "user": user,
                "balances": acc[0].get(user.id, {}).get("balances", []) + newbalance,
                "owed_amount": balance_amount,
                "paid_amount": paid_amount,
            }
        else:
            acc[1][user.id] = {
                "user": user,
                "balances": acc[1].get(user.id, {}).get("balances", []) + newbalance,
                "owed_amount": balance_amount,
                "paid_amount": paid_amount,
            }
        return acc

    balances = reduce(get_result, q, (
        OrderedDict(), OrderedDict()
    ))

    balances_owned_dump = balance_sum_schema.dump(balances[0].values())
    balances_owed_dump = balance_sum_schema.dump(balances[1].values())
    return (balances_owned_dump, balances_owed_dump)


def join_pad_tables(q1, q2):
    # q1 and q2 are lists of tuple (id, amount)
    # sorted by ascending id

    q1_i = 0
    q2_i = 0

    result = []

    app.logger.debug("JOINPAD START, q1 %s q2 %s", q1, q2)

    while q1_i < len(q1) or q2_i < len(q2):
        app.logger.debug("    In JOINPAD q1_i %s q2_i %s", q1_i, q2_i)
        q1_id, q1_amount = q1[q1_i] if q1_i < len(q1) else (math.inf,
                                                            Decimal(0.0))
        q2_id, q2_amount = q2[q2_i] if q2_i < len(q2) else (math.inf,
                                                            Decimal(0.0))

        if q1_id < q2_id:
            result.append((
                q1_id, q1_amount, Decimal(0.0)
            ))
            q1_i += 1
        if q1_id > q2_id:
            result.append((
                q2_id, Decimal(0.0), q2_amount
            ))
            q2_i += 1
        else:
            # this happens when q1_id and q2_id are equal
            result.append((
                q1_id, q1_amount, q2_amount
            ))
            q1_i += 1
            q2_i += 1

    return result


def apply_func(data, func):
    return [
        (id, func(a1, a2))
        for id, a1, a2 in data
    ]


def get_user(data):
    return [
        (User.query.get(id), *rest)
        for id, *rest in data
    ]


def get_data_old(current_identity):
    app.logger.debug("SETTLMENETS GET DATA %s",
                     current_identity.settlements.all())

    # balance from cur to other (cur most pay other)
    balance_from = db.session.query(
        Balance.to_user_id.label("bal_id"),
        func.coalesce(func.sum(Balance.amount),
                      literal_column("0.0")).label("bal_amount")
    ).filter(
        Balance.from_user_id == current_identity.id,
        Balance.to_user_id != current_identity.id,
        # Balance.paid.is_(False)  # TODO
    ).group_by("bal_id").order_by("bal_id")

    # balance from other to cur (other must pay cur)
    balance_to = db.session.query(
        Balance.from_user_id.label("bal_id"),
        func.coalesce(func.sum(Balance.amount),
                      literal_column("0.0")).label("bal_amount")
    ).filter(
        Balance.from_user_id != current_identity.id,
        Balance.to_user_id == current_identity.id,
        # Balance.paid.is_(False)  # TODO
    ).group_by("bal_id").order_by("bal_id")

    app.logger.info("BALANCE_FROM %s", balance_from.all())
    app.logger.info("BALANCE_TO %s", balance_to.all())

    balance_data = apply_func(
        join_pad_tables(balance_from.all(), balance_to.all()),
        operator.sub
    )

    app.logger.info("BALANCE_DATA %s",
                    join_pad_tables(balance_from.all(), balance_to.all()))

    # payment from cur to other
    payments_from = db.session.query(
        Payment.to_user_id.label("pay_id"),
        func.coalesce(func.sum(Payment.amount),
                      literal_column("0.0")).label("pay_amount")
    ).filter(
        Payment.from_user_id == current_identity.id,
        Payment.to_user_id != current_identity.id,
        Payment.accepted.is_(True)
    ).group_by("pay_id").order_by("pay_id")

    # payment from other to cur
    payments_to = db.session.query(
        Payment.from_user_id.label("pay_id"),
        func.coalesce(func.sum(Payment.amount),
                      literal_column("0.0")).label("pay_amount")
    ).filter(
        Payment.from_user_id != current_identity.id,
        Payment.to_user_id == current_identity.id,
        Payment.accepted.is_(True)
    ).group_by("pay_id").order_by("pay_id")

    app.logger.info("PAYMENT_FROM %s", payments_from.all())
    app.logger.info("PAYMENT_TO %s", payments_to.all())

    payment_data = apply_func(
        join_pad_tables(payments_from.all(), payments_to.all()),
        operator.sub
    )

    app.logger.info("PAYMENTS_DATA_REAL %s", payment_data)

    result_data = get_user(join_pad_tables(balance_data, payment_data))

    # app.logger.info("RESULT DATA%s", result_data)

    return get_data_list(result_data)


def get_data(current_identity):
    id = current_identity.id
    balance_owned = []
    balance_owed = []
    for s in current_identity.settlements:
        to_add = {
            "user": User.query.get(s.get_other_user_id(id)),
            "balances": [],
            "owed_amount": s.get_owed_amount(id),
            "paid_amount": s.get_paid_amount(id),
        }

        if to_add.get("owed_amount") == to_add.get("paid_amount"):
            continue
        elif to_add.get("owed_amount") > to_add.get("paid_amount"):
            balance_owned.append(to_add)
        else:
            to_add["owed_amount"] = -1 * s.get_owed_amount(id)
            to_add["paid_amount"] = -1 * s.get_paid_amount(id)

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

    return {
        "balances_owned": data[0],
        # "balances_owed": balances_owed,
        "balances_owed": data[1],
    }
