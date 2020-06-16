from flask import Blueprint, request, current_app as app
from flask_api import status
from flask_jwt import current_identity, jwt_required
from pprint import pformat
from functools import reduce
from collections import OrderedDict

# from flask_cors import cross_origin
from datetime import date
from sqlalchemy.sql import func

from .meta import db
# from .auth import identity
from .models import User, Receipt, Balance, Payment
from .schemas import UserSchema, ReceiptSchema, BalanceSchema, \
    BalanceSumSchema, PaymentSchema, \
    RECEIPT_INFO_EXCLUDE_FIELDS
from .forms import ReceiptForm, PaymentForm
from .helpers import calculate_balances, ok, err

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


@views.route('/receipt', methods=['GET'])
@jwt_required()
def receipt_list():
    receipts_owned = receipts_schema.dump(current_identity.receipts_owned)
    receipts_of = receipts_schema.dump(current_identity.receipts_of)

    receipt_result = {
        "receipts_owned": receipts_owned,
        "receipts_of": receipts_of
    }

    app.logger.info("/receipt GET receipts_of - %s", receipts_of)
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

    json_data["balances"] = calculate_balances(json_data)
    receipt_data = receipt_schema.load(json_data, session=db.session)

    receipt_data.user = current_identity

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
        # TODO try catch
        json_data["balances"] = calculate_balances(json_data)

        app.logger.info("receipt/%s json data is %s", id, pformat(json_data))
        app.logger.info("receipt/%s balances is %s", id, json_data["balances"])
        receipt_data = receipt_schema.load(json_data, session=db.session)

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

    current_identity.add_friend(friend)

    db.session.commit()

    friend_dump = user_schema.dump(friend)

    app.logger.info("/friend/%s added for %s - ", username,
                    current_identity.username, friend_dump)

    return friend_dump, status.HTTP_200_OK


@views.route('/friends', methods=['GET'])
@jwt_required()
def friend_list():
    friends = users_schema.dump(current_identity.friends)
    app.logger.info("/friend list get - %s - %s", current_identity.username,
                    friends)

    friend_result = {
        "friends": friends
    }

    return friend_result, status.HTTP_200_OK


def get_balance_list(q):
    def find_balances(acc, cur):
        user, balance, total = cur
        acc[user.id] = {
            "user": user,
            "total": total,
            "balances": acc.get(user.id, {}).get("balances", []) + [balance]
        }
        return acc

    balances = list(reduce(find_balances, q, OrderedDict()).values())
    balances_dump = balance_sum_schema.dump(balances)
    return balances_dump


def get_balances_of(current_identity):
    b = db.session.query(
        Balance.id,
        Balance.to_user_id,
        Balance.amount
    ).filter(
        Balance.to_user_id != current_identity.id,
        Balance.from_user_id == current_identity.id
    ).subquery()

    s = db.session.query(
        b.c.to_user_id,
        func.sum(b.c.amount).label('total'),
    ).select_from(b).group_by(
        b.c.to_user_id
    ).subquery()

    q = db.session.query(
        User,
        Balance,
        s.c.total,
    ).select_from(
        b
    ).join(
        s,
        b.c.to_user_id == s.c.to_user_id
    ).join(
        User,
        User.id == b.c.to_user_id
    ).join(
        Balance,
        Balance.id == b.c.id
    ).all()

    return get_balance_list(q)


def get_balances_owed(current_identity):
    b = db.session.query(
        Balance.id,
        Balance.from_user_id,
        Balance.amount
    ).filter(
        Balance.from_user_id != current_identity.id,
        Balance.to_user_id == current_identity.id
    ).subquery()

    s = db.session.query(
        b.c.from_user_id,
        func.sum(b.c.amount).label('total'),
    ).select_from(b).group_by(
        b.c.from_user_id
    ).subquery()

    q = db.session.query(
        User,
        Balance,
        s.c.total,
    ).select_from(
        b
    ).join(
        s,
        b.c.from_user_id == s.c.from_user_id
    ).join(
        User,
        User.id == b.c.from_user_id
    ).join(
        Balance,
        Balance.id == b.c.id
    ).all()

    return get_balance_list(q)


@views.route('/balancesums', methods=['GET'])
@jwt_required()
def balance_sums():
    balances_of = get_balances_of(current_identity)
    balances_owed = get_balances_owed(current_identity)

    app.logger.info("/balancesums result - %s", pformat(balances_of))

    return {
        "balances_owed": balances_owed,
        "balances_of": balances_of
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
    ).all()

    payments_dump = payments_schema.dump(payments)
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

    if (action == "accept" or action == "reject") and request.method == 'POST':
        # change accepted value
        payment.accepted = (action == "accept")
        db.session.commit()

        payment_dump = payment_schema.dump(payment)
        app.logger.debug("payments %s - %s", action, payment_dump)
        return payment_dump

    return err("Should not get here"), status.HTTP_500_INTERNAL_SERVER_ERROR


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
