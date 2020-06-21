from flask import Blueprint, request, current_app as app
from flask_api import status
from flask_jwt import current_identity, jwt_required
from pprint import pformat
from functools import reduce
from collections import OrderedDict
from decimal import Decimal

# from flask_cors import cross_origin
from datetime import date
from sqlalchemy.sql import func
from sqlalchemy import and_, exists, or_

from .meta import db
# from .auth import identity
from .models import User, Receipt, Balance, Payment, Settlement, Friend
from .schemas import UserSchema, ReceiptSchema, BalanceSchema,\
    BalanceSumSchema, PaymentSchema, FriendSchema, RECEIPT_INFO_EXCLUDE_FIELDS
from .forms import ReceiptForm, PaymentForm
from .helpers import calculate_balances, ok, err, accept_reject_view, \
    create_view, View, get_model_view

# import requests


views = Blueprint('views', __name__)


user_schema = UserSchema()
users_schema = UserSchema(many=True)

balances_schema = BalanceSchema(many=True)
balance_sum_schema = BalanceSumSchema(many=True)

receipt_schema = ReceiptSchema()
receipts_schema = ReceiptSchema(many=True, exclude=RECEIPT_INFO_EXCLUDE_FIELDS)

payment_schema = PaymentSchema()
payments_schema = PaymentSchema(many=True)

friend_schema = FriendSchema()
friends_schema = FriendSchema(many=True)


@views.route('/receipt', methods=['GET'])
@jwt_required()
def receipt_list():
    receipts_owned = receipts_schema.dump(current_identity.receipts_owned)
    receipts_owed = receipts_schema.dump(current_identity.receipts_owed)

    receipt_result = {
        "receipts_owned": receipts_owned,
        "receipts_owed": receipts_owed
    }

    app.logger.info("/receipt GET receipts_owed - %s", receipts_owed)
    app.logger.info("/receipt GET - %s", receipt_result)

    return receipt_result, status.HTTP_200_OK


@views.route('/receipt/-1', methods=['GET', 'POST', 'PUT'])
@jwt_required()
def receipt_create():
    if request.method == 'GET':
        return {
            "name": "New Receipt",
            "amount": 0.0,
            "date": str(date.today()),
            "user": user_schema.dump(current_identity),
            "users": [],
            "receipt_items": [],
            "balances": [],
            "resolved": False
        }, status.HTTP_200_OK

    if not request.is_json:
        return err("Not JSON"), status.HTTP_400_BAD_REQUEST

    json_data = request.get_json()

    if id in json_data:
        del json_data["id"]

    form = ReceiptForm.from_json(json_data)
    if not form.validate():
        app.logger.info("receipt/-1 form errors - %s", form.errors)
        return form.errors, status.HTTP_400_BAD_REQUEST

    app.logger.info("receipt/-1 input json data - %s", json_data)

    receipt_data = receipt_schema.load(json_data, session=db.session)

    receipt_data.user = current_identity
    calculate_balances(receipt_data)

    app.logger.debug("receipt creation users: %s", receipt_data.users)
    # update all settlements

    db.session.add(receipt_data)
    db.session.commit()

    receipt_dump = receipt_schema.dump(receipt_data)

    app.logger.info("receipt/-1 return data with balances - %s",
                    receipt_dump)

    return receipt_dump, status.HTTP_201_CREATED


@views.route('/receipt/<int:id>', methods=['GET', 'PUT', 'PATCH', 'DELETE'])
@jwt_required()
def receipt_by_id(id):
    receipt = Receipt.query.get(id)

    app.logger.info("receipt/%s %s", id, receipt)

    if not receipt:
        app.logger.info("receipt/%s does not exist", id)

        return err("Receipt with id does not exist"),\
            status.HTTP_404_NOT_FOUND

    if request.method == 'GET':
        receipt_dump = receipt_schema.dump(receipt)

        app.logger.info("receipt/%s GET %s", id, receipt_dump)

        return receipt_dump, status.HTTP_200_OK

    # TODO
    if receipt.user != current_identity:
        app.logger.info("receipt/%s unauthorized for %s", id,
                        current_identity)
        return err("Your do not own this receipt"),\
            status.HTTP_401_UNAUTHORIZED
    # if receipt.user != current_identity and\
    #         current_identity not in receipt.users:
    #     app.logger.info("receipt/%s unauthorized for %s", id,
    #                     current_identity)
    #     return err("Your do not own this receipt"),\
    #         status.HTTP_401_UNAUTHORIZED

    if request.method == 'DELETE':
        app.logger.info("Deleting receipt/%s", id)

        db.session.delete(receipt)
        db.session.commit()

        return ok("Success"), status.HTTP_200_OK

    if not request.is_json:
        app.logger.info("receipt/%s is not JSON", id)
        return err("Not JSON"), status.HTTP_400_BAD_REQUEST

    json_data = request.get_json()

    form = ReceiptForm.from_json(json_data)
    if not form.validate():
        app.logger.info("receipt/%s form errors - %s", id, form.errors)
        return form.errors, status.HTTP_400_BAD_REQUEST

    if request.method == 'PUT' or request.method == 'PATCH':
        receipt_data = receipt_schema.load(json_data, session=db.session)
        calculate_balances(receipt_data)

        app.logger.debug("receipt creation users: %s", receipt_data.users)
        app.logger.debug("receipt user id: %s", current_identity.id)

        db.session.commit()

        receipt_dump = receipt_schema.dump(receipt_data)

        app.logger.info("receipt/%s return data with balances - %s", id,
                        receipt_dump)

        return receipt_dump, status.HTTP_200_OK

    app.logger.err("receipt/%s Unknown error", id)

    return err("should not get here"), status.HTTP_500_INTERNAL_SERVER_ERROR


@views.route('/user', methods=['GET'])
@jwt_required()
def user():
    user_dump = user_schema.dump(current_identity)
    app.logger.info("/user data - %s", user_dump)
    return user_dump, status.HTTP_200_OK


@views.route('/friend/<username>', methods=['POST'])
@jwt_required()
def friend_add(username):
    friend = User.query.filter_by(username=username).first()

    if friend is None:
        app.logger.info("/friend/%s does not exist - %s", username,
                        current_identity.username)
        return err("friend does not exist"), status.HTTP_400_BAD_REQUEST

    if friend == current_identity:
        app.logger.info("/friend/%s is self - %s", username,
                        current_identity.username)
        return err("cannot friend yourself"), status.HTTP_400_BAD_REQUEST

    if friend in current_identity.friends or friend in friend.friends:
        app.logger.info("/friend/%s already added - %s", username,
                        current_identity.username)
        return err("friend already added"), status.HTTP_400_BAD_REQUEST

    friend_request = Friend(from_user=current_identity, to_user=friend)

    db.session.add(friend_request)
    db.session.commit()

    friend_dump = friend_schema.dump(friend_request)

    app.logger.info("/friend/%s request for %s - ",
                    current_identity.username, friend_dump)

    return friend_dump, status.HTTP_200_OK


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
        Balance.to_user_id != current_identity.id
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
        Balance.to_user_id == current_identity.id  # to is paid
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

    app.logger.info("/balancesums result - %s", pformat(balances_owned))

    return {
        "balances_owed": balances_owed,
        "balances_owned": balances_owned
    }


def get_payments_received(current_identity):
    payments = Payment.query.filter_by(
        accepted=None,
        to_user_id=current_identity.id,
        archived=False
    ).all()

    payments_dump = payments_schema.dump(payments)
    app.logger.debug("get payments received - %s", payments_dump)
    return payments_dump


def get_payments_sent(current_identity):
    payments = Payment.query.filter_by(
        from_user_id=current_identity.id,
        archived=False
    )

    payments_dump = payments_schema.dump(payments.all())

    # archive payments not archived yet which are not in "pending" state
    # (null)
    payments.filter(
        Payment.accepted.isnot(None)
    ).update({"archived": True})

    db.session.commit()

    app.logger.debug("get payments sent - %s", payments_dump)
    return payments_dump


@views.route('/payments', methods=['GET'])
@jwt_required()
def get_payments():
    app.logger.debug("GET PAYMENTS/")
    payments_received = get_payments_received(current_identity)
    payments_sent = get_payments_sent(current_identity)

    payments_result = {
        "payments_received": payments_received,
        "payments_sent": payments_sent
    }
    app.logger.debug("/payments result - %s", payments_result)
    return payments_result


@views.route('/payments/<int:id>')
@views.route('/payments/<int:id>/<action>', methods=['GET', 'POST'])
@jwt_required()
def get_payment(id, action=None):
    payment = Payment.query.get(id)

    if not payment:
        return err("requested payment does not exist"),
    status.HTTP_404_NOT_FOUND

    if payment.to_user != current_identity and \
            payment.from_user != current_identity:
        return err("you are not authorized to view this payment"),
    status.HTTP_401_UNAUTHORIZED

    if action is None and request.method == 'GET':
        payment_dump = payment_schema.dump(payment)
        return payment_dump

    # accept or reject bahavior after

    if payment.to_user != current_identity:
        return err("you are not authorized to accept or reject this payment"),
    status.HTTP_401_UNAUTHORIZED

    # change accepted value
    app.logger.info("action is: %s", action)
    app.logger.info("method is: %s", request.method)

    if (action == "accept" or action == "reject") and request.method == 'POST':
        app.logger.debug("inside if statement")

        if action == "accept":
            app.logger.debug("in accept")

            if payment.accept():
                app.logger.info("accepted payment %s", id)
                db.session.commit()

        if action == "reject":
            app.logger.debug("in reject")

            if payment.reject():
                app.logger.info("rejected payment %s", id)
                db.session.commit()

        payment_dump = payment_schema.dump(payment)
        app.logger.debug("payments %s - %s", action, payment_dump)
        return payment_dump

    return err("Should not get here"), status.HTTP_500_INTERNAL_SERVER_ERROR


@views.route('/friends', methods=['GET'])
@jwt_required()
def friend_list():
    friends = users_schema.dump(current_identity.friends)
    friends_received = friends_schema.dump(
        Friend.get_received(current_identity)
    )
    friends_sent = friends_schema.dump(
        Friend.get_sent(current_identity)
    )
    app.logger.info("/friend list get - %s - %s", current_identity.username,
                    friends)

    friend_result = {
        "friends_received": friends_received,
        "friends_sent": friends_sent,
        "friends": friends
    }

    return friend_result, status.HTTP_200_OK


@views.route('/friends/<int:id>')
@views.route('/friends/<int:id>/<action>', methods=["GET", "POST"])
@jwt_required()
def friends(id, action=None):
    return create_view(
        [
            View(
                methods=["GET"],
                view=get_model_view,
                auth_attrs=["to_user", "from_user"],
            ),
            View(
                methods=["POST"],
                auth_attrs=["to_user", "from_user"],
                view=accept_reject_view,
                view_args=[action]
            )
        ],
        obj=Friend.query.get(id),
        schema=friend_schema
    )


@views.route('/payment', methods=['POST'])
@jwt_required()
def pay_user():
    # accept json with
    # message
    # amount
    # to_user

    if request.method == 'POST':
        if not request.is_json:
            return err("Not JSON"), status.HTTP_400_BAD_REQUEST

        json_data = request.get_json()

        app.logger.info("/pay POST - %s", json_data)

        form = PaymentForm.from_json(json_data)
        if not form.validate():
            app.logger.info("pay form errors - %s", form.errors)
            return form.errors, status.HTTP_400_BAD_REQUEST

        # TODO dont know if this is neccesary
        to_user = json_data.get("to_user")

        app.logger.info("/pay to_user %s", to_user)

        if to_user is None:
            return err("to_user is not specified"), status.HTTP_400_BAD_REQUEST

        json_data["from_user"] = user_schema.dump(current_identity)

        app.logger.debug("BEFORE PAYMENT SCHEMA LOAD")
        app.logger.info("/pay POST JSON_DATA - %s", json_data)

        pay_data = payment_schema.load(json_data, session=db.session)

        app.logger.debug("AFTER PAYMENT SCHEMA LOAD")

        if pay_data.to_user not in current_identity.friends:
            return err("Cannot pay a non-friended user"),\
                status.HTTP_400_BAD_REQUEST

        if pay_data.to_user == current_identity:
            return err("Cannot pay yourself"),\
                status.HTTP_400_BAD_REQUEST

        # pay_data.from_user = current_identity

        db.session.add(pay_data)
        db.session.commit()

        pay_dump = payment_schema.dump(pay_data)

        return pay_dump, status.HTTP_201_CREATED

    return err("should not get here"), status.HTTP_500_INTERNAL_SERVER_ERROR
