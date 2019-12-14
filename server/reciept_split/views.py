from flask import Blueprint, request
from flask_api import status
from flask_jwt import current_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash

from datetime import date
import simplejson as json

from .meta import db
from .auth import identity
from .models import User, Reciept
from .schemas import RecieptSchema
from .forms import RecieptForm


views = Blueprint('views', __name__)


reciept_schema = RecieptSchema()


@views.route('/reciept_list', methods=['GET'])
@jwt_required()
def reciept_list():
    # current_identity = User.query.all()[0]
    reciept_list = [reciept_schema.dump(r) for r in current_identity.reciepts]
    return reciept_list, status.HTTP_200_OK


@views.route('/reciept_add', methods=['GET', 'POST'])
@jwt_required()
def register():
    # current_identity = User.query.all()[0]
    if request.method == 'GET':
        return {"message": "send name, amount, date"}
    form = RecieptForm.from_json(request.data)
    print(form)
    if request.method == 'POST' and form.validate():
        reciept = Reciept(name=form.name.data,
                          amount=form.amount.data,
                          date=form.date.data,
                          user_id=current_identity.id)
        db.session.add(reciept)
        db.session.commit()
        reciept_dump = reciept_schema.dump(reciept)
        return reciept_dump, status.HTTP_200_OK
    return form.errors, status.HTTP_400_BAD_REQUEST
