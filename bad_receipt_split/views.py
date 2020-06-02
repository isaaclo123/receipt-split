from flask import Blueprint, request, Response
from flask_api import status
from flask_jwt import current_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash

# from flask_cors import cross_origin
from datetime import date
import simplejson

from .meta import db
from .auth import identity
from .models import User, Receipt
from .schemas import UserSchema, ReceiptSchema, BalanceSchema
from .forms import ReceiptForm
from .helpers import calculate_balances

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
    print("ALLREC")
    receipts_owned = receipts_schema.dump(current_identity.receipts_owned)
    receipts_owned_map = {r["id"]: True for r in receipts_owned}

    receipts_in = receipts_schema.dump(current_identity.receipts_in)
    receipt_notin_owned = [
        r for r in receipts_in if r["id"] not in receipts_owned_map
    ]

    all_receipts = receipts_owned + receipt_notin_owned

    # return all_receipts, status.HTTP_200_OK
    # return [], status.HTTP_200_OK
    return all_receipts


# @cross_origin(headers=['Content-Type', 'Authorization'])
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
        return {"error": "Not JSON"}, status.HTTP_400_BAD_REQUEST

    print("---JSON DATA---")
    json_data = request.get_json()
    print(json_data)
    print("---JSON DATA---")
    # json_data = request.data
    # json_data = request.data
    if id in json_data:
        del json_data["id"]

    form = ReceiptForm.from_json(json_data)
    if not form.validate():
        return form.errors, status.HTTP_400_BAD_REQUEST

    json_data["balances"] = calculate_balances(json_data)
    print("BEFORE RECIPT SCHEMA")
    receipt_data = receipt_schema.load(json_data)
    print("AFTER RECIPT SCHEMA")

    receipt_data.user = current_identity

    db.session.add(receipt_data)
    db.session.commit()

    receipt_dump = receipt_schema.dump(receipt_data)

    return receipt_dump, status.HTTP_201_CREATED


@views.route('/receipt/<int:id>', methods=['GET', 'PUT', 'PATCH', 'DELETE'])
@jwt_required()
def receipt_by_id(id):
    print("ID---------")
    print(id)
    print("ID---------")
    receipt = Receipt.query.get(id)
    print(receipt)

    if not receipt:
        return {"error": "Receipt with id does not exist"},\
                status.HTTP_404_NOT_FOUND
    print(receipt)

    if request.method == 'GET':
        receipt_dump = receipt_schema.dump(receipt)
        return receipt_dump, status.HTTP_200_OK

    if receipt.user != current_identity:
        return {"error": "Your do not own this receipt"},\
                status.HTTP_401_UNAUTHORIZED

    if request.method == 'DELETE':
        db.session.delete(receipt)
        db.session.commit()
        return {"message": "Success"}, status.HTTP_200_OK

    print(request)
    if not request.is_json:
        return {"error": "Not JSON"}, status.HTTP_400_BAD_REQUEST

    print("--------reciptuser")
    print(receipt.user)
    print("--------reciptuser")

    print("--------reciptuser")

    json_data = request.get_json()
    # json_data = request.data

    print("JSON DATA START")
    print(json_data)
    print("JSON DATA END")

    form = ReceiptForm.from_json(json_data)
    print("AFTERFORM")
    print(form)
    if not form.validate():
        return form.errors, status.HTTP_400_BAD_REQUEST

    if request.method == 'PUT' or request.method == 'PATCH':
        # json_data["id"] = id
        # receipt.query.update(json_data)
        print("receipt_data")
        # delete old balances
        for oldbalance in receipt.balances:
            db.session.delete(oldbalance)

        json_data["balances"] = calculate_balances(json_data)
        print(json_data["balances"])
        receipt_data = receipt_schema.load(json_data, session=db.session)

        print("RECPTDATAJk-===================")
        print(receipt_data.balances)
        print("RECPTDATAJk-===================")
        print(receipt_data)
        print("afterreceipt_data")
        # print(receipt_data)

        # db.session.merge(receipt_data)
        db.session.commit()

        print("AFTERALL+__________")
        print(receipt.user)
        print("AFTERALL+__________")

        receipt_dump = receipt_schema.dump(receipt_data)
        return receipt_dump, status.HTTP_200_OK

    return {"error": "should not get here"}, status.HTTP_400_BAD_REQUEST


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
        return {"error": "friend does not exist"}, status.HTTP_400_BAD_REQUEST

    if friend == current_identity:
        return {"error": "cannot friend yourself"}, status.HTTP_400_BAD_REQUEST

    if friend in current_identity.friends:
        return {"error": "friend already added"}, status.HTTP_400_BAD_REQUEST

    current_identity.add_friend(friend)
    db.session.commit()

    friend_dump = user_schema.dump(friend)
    return friend_dump, status.HTTP_200_OK


@views.route('/friends', methods=['GET'])
@jwt_required()
def friend_list():
    friends = users_schema.dump(current_identity.friends)
    return friends, status.HTTP_200_OK
