from flask import Blueprint, request
from flask_api import status
from werkzeug.security import generate_password_hash, check_password_hash

from .meta import db
from .models import User

from flask_cors import CORS


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
    # if request.method == 'OPTIONS':
    #     return {"message": "stuff"}, status.HTTP_200_OK

    if request.method == 'POST':
        username = request.data.get('username')
        fullname = request.data.get('fullname')
        password = request.data.get('password')

        user = User.query.filter_by(username=username).first()

        if user:
            return {"error": "username already exists"}, \
                status.HTTP_403_FORBIDDEN

        new_user = User(username=username,
                        fullname=fullname,
                        password=generate_password_hash(password,
                                                        method='sha256'))

        # add the new user to the database
        db.session.add(new_user)
        db.session.commit()

    return {"message": "POST username, fullname, and password to this API"}
