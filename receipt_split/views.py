from flask import Blueprint, request, Response
from flask_api import status
from flask_jwt import current_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from marshmallow import ValidationError

# from flask_cors import cross_origin
from datetime import date
import simplejson

from .meta import db
from .auth import identity
from .models import User, Receipt
from .schemas import UserSchema, ReceiptSchema, BalanceSchema
# from .forms import ReceiptForm
from .helpers import calculate_balances, ok, err

import requests


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
    receipts_owned_map = {r["id"]: True for r in receipts_owned}

    receipts_in = receipts_schema.dump(current_identity.receipts_in)
    receipt_notin_owned = [
        r for r in receipts_in if r["id"] not in receipts_owned_map
    ]

    all_receipts = receipts_owned + receipt_notin_owned

    return all_receipts, status.HTTP_200_OK


@views.route('/receipt/-1', methods=['GET', 'POST', 'PUT'])
# @cross_origin(headers=['Content-Type', 'Authorization'])
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

    try:
        json_data = request.get_json()
        # json_data = request.data
        if id in json_data:
            del json_data["id"]

        receipt = receipt_schema.load(json_data)
        receipt.user = current_identity

        balances = calculate_balances(receipt)
        print(balances)
        receipt.balances = balances_schema.load(balances)
        print(receipt)

        db.session.add(receipt)
        db.session.commit()

        # send receipt data
        receipt_dump = receipt_schema.dump(receipt)
        return receipt_dump, status.HTTP_201_CREATED
    except ValidationError as e:
        return e.messages, status.HTTP_400_BAD_REQUEST
    except Exception as e:
        return err(str(e)), status.HTTP_400_BAD_REQUEST

    return err("should not get here"), status.HTTP_400_BAD_REQUEST



@views.route('/receipt/<int:id>', methods=['GET', 'PUT', 'PATCH', 'DELETE'])
@jwt_required()
def receipt_by_id(id):
    receipt = Receipt.query.get(id)

    if not receipt:
        return err("Receipt with id does not exist"),\
                   status.HTTP_404_NOT_FOUND

    if request.method == 'GET':
        receipt_dump = receipt_schema.dump(receipt)
        return receipt_dump, status.HTTP_200_OK

    if receipt.user != current_identity:
        return err("Your do not own this receipt"),\
                   status.HTTP_401_UNAUTHORIZED

    if request.method == 'DELETE':
        db.session.delete(receipt)
        db.session.commit()
        return ok("Success"), status.HTTP_200_OK

    if not request.is_json:
        return err("Not JSON"), status.HTTP_400_BAD_REQUEST

    if request.method == 'PUT' or request.method == 'PATCH':
        print("BEFORE RECIEPTJk ")
        try:
            json_data = request.get_json()
            receipt = receipt_schema.load(json_data)

            # print("BEFORE DELETE")
            # for oldbalance in receipt.balances:
            #     db.session.delete(oldbalance)
            # print("AFTER DELETE")

            # receipt["balances"] = calculate_balances(receipt)
            print("BEFORE BALANCES")
            balances = calculate_balances(receipt)
            print(balances)
            print("BEFORE BALANCES SET")
            receipt.balances = balances_schema.load(balances)

            print("BEFORE COMMIT")
            db.session.commit()

            # send receipt data
            receipt_dump = receipt_schema.dump(receipt)
            print(receipt_dump)
            return receipt_dump, status.HTTP_200_OK
        except ValidationError as e:
            print("ERR")
            print(e.messages)
            return e.messages, status.HTTP_400_BAD_REQUEST
        except Exception as e:
            return err(str(e)), status.HTTP_400_BAD_REQUEST

    return err("should not get here"), status.HTTP_400_BAD_REQUEST


@views.route('/user', methods=['GET'])
@jwt_required()
def user():
    user_dump = user_schema.dump(current_identity)
    return user_dump, status.HTTP_200_OK


@views.route('/friend/<username>', methods=['POST'])
@jwt_required()
def friend_add(username):
    friend = User.query.filter_by(username=username).first()

    if friend is None:
        return err("friend does not exist"), status.HTTP_400_BAD_REQUEST

    if friend == current_identity:
        return err("cannot friend yourself"), status.HTTP_400_BAD_REQUEST

    if friend in current_identity.friends or friend in friend.friends:
        return err("friend already added"), status.HTTP_400_BAD_REQUEST

    if friend not in current_identity.friends:
        current_identity.friends.append(friend)
        db.session.add(current_identity)
        db.session.commit()

    if current_identity not in friend.friends:
        friend.friends.append(current_identity)
        db.session.add(friend)
        db.session.commit()

    friend_dump = user_schema.dump(friend)
    return friend_dump, status.HTTP_200_OK


@views.route('/friends', methods=['GET'])
@jwt_required()
def friend_list():
    friends = users_schema.dump(current_identity.friends)
    return friends, status.HTTP_200_OK


@views.route('/proxy')
def proxy():
    result = requests.get(request.args['url'])
    resp = Response(result.text)
    resp.headers['Content-Type'] = 'application/json'
    return resp
