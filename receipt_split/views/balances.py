from flask import current_app as app
from flask_jwt import current_identity, jwt_required
from functools import reduce
from collections import OrderedDict

from receipt_split.schemas import balance_sum_schema
from receipt_split.models import Balance, Settlement, User
from receipt_split.meta import db
from sqlalchemy import and_
from . import views


def get_balance_list(q):
    def find_balances(acc, cur):
        user, balance, owed_amount, paid_amount = cur
        acc[user.id] = {
            "user": user,
            "balances": acc.get(user.id, {}).get("balances", []) + [balance],
            "owed_amount": owed_amount,
            "paid_amount": paid_amount,
        }
        return acc

    balances = list(reduce(find_balances, q, OrderedDict()).values())
    balances_dump = balance_sum_schema.dump(balances)
    return balances_dump


def get_balances_owned(current_identity):
    # balances curr user must pay
    app.logger.debug("OWNED------START")

    # balance: FROM pays TO

    # balances addressed to curr user, so curr user must pay it
    # this returns id of user issuing balances to curr user
    balance_ids_q = db.session.query(
        Balance.from_user_id,
    ).filter(
        Balance.from_user_id == current_identity.id,
        Balance.to_user_id != current_identity.id,
        Balance.paid.is_(False)
    )
    balance_ids = balance_ids_q.subquery()
    app.logger.debug("owned balances_ids %s", balance_ids_q.all())

    # settlements curr user owes to others for balances above
    settlements_ids_q = db.session.query(
        Settlement.from_user_id,
        Settlement.to_user_id,
        Settlement.owed_amount,
        Settlement.paid_amount
    ).filter(
        Settlement.from_user_id == current_identity.id,
        Settlement.from_user_id.in_(balance_ids)
    )
    settlements_ids = settlements_ids_q.subquery()
    app.logger.debug("owned settlements_ids %s", settlements_ids_q.all())

    q = db.session.query(
        User,
        Balance,
        settlements_ids.c.owed_amount,
        settlements_ids.c.paid_amount
    ).select_from(
        settlements_ids
    ).join(  # get uer balance is from
        User,
        User.id == settlements_ids.c.to_user_id,
    ).join(  # balances addressed to current user, must be paid my curr
        Balance,
        and_(
            Balance.paid.is_(False),
            Balance.to_user_id == User.id,
            Balance.from_user_id == current_identity.id,
        ),
    )
    app.logger.debug("q %s", q.all())

    app.logger.debug("OWNED------END")

    return get_balance_list(q.all())


def get_balances_owed(current_identity):
    # balance ids for
    # balances not from current user
    # balances are given to current user
    # aka balances current user has to pay
    app.logger.debug("OWED------START")

    # balance: FROM pays TO

    # balances addressed from curr user, so other user must pay it
    # this returns id of balances owed to curr user
    balance_ids_q = db.session.query(
        Balance.from_user_id,
    ).filter(
        Balance.from_user_id != current_identity.id,  # from is payer
        Balance.to_user_id == current_identity.id,  # to is paid
        Balance.paid.is_(False)
    )
    balance_ids = balance_ids_q.subquery()
    app.logger.debug("owed balances_ids %s", balance_ids_q.all())

    # settlements curr user owes to others for balances above
    settlements_ids_q = db.session.query(
        Settlement.from_user_id,
        Settlement.to_user_id,
        Settlement.owed_amount,
        Settlement.paid_amount,
    ).filter(
        Settlement.to_user_id == current_identity.id,  # to me
        Settlement.from_user_id.in_(balance_ids)  # from others
    )
    settlements_ids = settlements_ids_q.subquery()
    app.logger.debug("owed settlements_ids %s", settlements_ids_q.all())

    q = db.session.query(
        User,
        Balance,
        settlements_ids.c.owed_amount,
        settlements_ids.c.paid_amount
    ).select_from(
        settlements_ids
    ).join(  # get user that Balance is from, the user curr user must pay
        User,
        User.id == settlements_ids.c.from_user_id,
    ).join(  # balances addressed to current user, must be paid my curr
        Balance,
        and_(
            Balance.paid.is_(False),
            Balance.from_user_id == User.id,
            Balance.to_user_id == current_identity.id,
        ),
    )
    app.logger.debug("q %s", q.all())

    app.logger.debug("OWED------END")

    return get_balance_list(q)


@views.route('/balancesums', methods=['GET'])
@jwt_required()
def balance_sums():
    balances_owned = get_balances_owned(current_identity)
    balances_owed = get_balances_owed(current_identity)

    return {
        "balances_owned": balances_owned,
        "balances_owed": balances_owed,
    }
