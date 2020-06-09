from flask import Blueprint, request, current_app as app
from flask_api import status
from flask_jwt import current_identity, jwt_required
# from pprint import pformat

# from flask_cors import cross_origin
from datetime import date

from .meta import db
# from .auth import identity
from .models import User, Receipt
from .schemas import UserSchema, ReceiptSchema, BalanceSchema
from .forms import ReceiptForm
from .helpers import calculate_balances, ok, err

# import requests


views = Blueprint('views', __name__)


user_schema = UserSchema()
users_schema = UserSchema(many=True)

balances_schema = BalanceSchema(many=True)

receipt_schema = ReceiptSchema()
receipts_schema = ReceiptSchema(many=True, exclude=('receipt_items',
                                                    'balances', 'users'))


@views.route('/balances', methods=['GET'])
@jwt_required()
def balance_list():
    balances_to = balances_schema.dump(current_identity.balances_to_user)
    balances_from = balances_schema.dump(current_identity.balances_from_user)
    # receipts_owned_map = {r["id"]: True for r in receipts_owned}

    all_balances = balances_to + balances_from

    return all_balances, status.HTTP_200_OK


@views.route('/receipt', methods=['GET'])
@jwt_required()
def receipt_list():
    receipts_owned = receipts_schema.dump(current_identity.receipts_owned)
    receipts_of = receipts_schema.dump(current_identity.receipts_of)

    receipt_result = {
        "receipts_owned": receipts_owned,
        "receipts_of": receipts_of
    }

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
        receipt_data = receipt_schema.load(json_data, session=db.session)

        db.session.commit()

        receipt_dump = receipt_schema.dump(receipt_data)

        app.logger.info("receipt/%s return data with balances - %s", id,
                        receipt_dump)

        return receipt_dump, status.HTTP_200_OK

    app.logger.err("receipt/%s Unknown error", id)

    return err("should not get here"), status.HTTP_400_BAD_REQUEST


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
