from flask import Blueprint, request
from flask_api import status
from flask_jwt import current_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash

from datetime import date
import simplejson

from .meta import db
from .auth import identity
from .models import User, Reciept
from .schemas import RecieptSchema
from .forms import RecieptForm


views = Blueprint('views', __name__)


reciept_schema = RecieptSchema()
reciepts_schema = RecieptSchema(many=True)


@views.route('/reciept', methods=['GET'])
@jwt_required()
def reciept_list():
    reciepts_dump = reciepts_schema.dump(current_identity.reciepts)
    return reciepts_dump, status.HTTP_200_OK


@views.route('/reciept/<int:id>',
             methods=['GET', 'UPDATE', 'DELETE'])
@jwt_required()
def reciept_by_id(id):
    reciept = Reciept.query.get(id)

    if not reciept:
        return {"error": "Reciept with id does not exist"},\
                status.HTTP_404_NOT_FOUND

    if request.method == 'GET':
        reciept_dump = reciept_schema.dump(reciept)
        return reciept_dump, status.HTTP_200_OK

    if not request.is_json:
        return {"error": "Not JSON"}, status.HTTP_400_BAD_REQUEST

    data = request.get_json()

    form = RecieptForm.from_json(data)
    if not form.validate():
        return form.errors, status.HTTP_400_BAD_REQUEST

    if request.method == 'UPDATE':
        reciept.update(data)
        db.session.commit()
        reciept_dump = reciept_schema.dump(reciept)
        return reciept_dump, status.HTTP_200_OK

    if request.method == 'DELETE':
        db.session.delete(reciept)
        db.session.commit()
        return None, status.HTTP_200_OK

    return {"error": "should not get here"}, status.HTTP_400_BAD_REQUEST


@views.route('/reciept', methods=['POST', 'PUT'])
@jwt_required()
def reciept_create():
    if not request.is_json:
        return {"error": "Not JSON"}, status.HTTP_400_BAD_REQUEST

    data = request.get_json()

    form = RecieptForm.from_json(data)
    if not form.validate():
        return form.errors, status.HTTP_400_BAD_REQUEST

    print("DATA--------")
    data["user_id"] = current_identity.id
    print(data)
    print("DATA--------")
    # data["user_id"] = current_identity.id
    reciept_data = reciept_schema.load(data)
    print("RECPDATA--------")
    print(reciept_data)
    print("DATA--------")

    db.session.add(reciept_data)
    db.session.commit()

    reciept_dump = reciept_schema.dump(reciept_data)
    print("RECPDATA--------")
    print(reciept_dump)
    print("DATA--------")

    return reciept_dump, status.HTTP_201_CREATED
