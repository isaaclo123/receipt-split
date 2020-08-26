from flask import Blueprint, request, current_app as app
from flask_api import status
from werkzeug.security import generate_password_hash, check_password_hash

from .forms import SignupForm
from .helpers import ok, err
from .meta import db
from .models import User


def authenticate(username, password):
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        return user


def identity(payload):
    user_id = payload['identity']
    return User.query.get(user_id)


auth = Blueprint('auth', __name__)


@auth.route('/signup', methods=['GET', 'POST'])
def signup_post():
    if not request.is_json:
        return err("Not JSON"), status.HTTP_400_BAD_REQUEST

    json_data = request.get_json()

    app.logger.debug("/signup input data - %s", json_data)

    username = json_data.get("username")
    if username is not None:
        user = User.query.filter_by(username=username).first()

        if user:
            error = {"username": "username already exists"}
            return error, status.HTTP_403_FORBIDDEN

    form = SignupForm.from_json(json_data)
    if not form.validate():
        app.logger.debug("/signup form errors - %s", form.errors)
        return form.errors, status.HTTP_400_BAD_REQUEST

    new_user = User(username=username,
                    fullname=json_data["fullname"],
                    password=generate_password_hash(json_data["password"],
                                                    method='sha256'))

    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    return ok("POST username, fullname, and password to this API")
