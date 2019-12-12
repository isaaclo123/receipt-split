from flask import Blueprint, render_template, redirect, url_for, request
from flask_api import status
from werkzeug.security import generate_password_hash, check_password_hash

from .models import db, User

auth = Blueprint('auth', __name__)


@auth.route('/signup', methods=['GET', 'POST'])
def signup_post():
    if request.method == 'POST':
        email = request.form.get('email')
        name = request.form.get('name')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()

        if user:
            return {"error": "email already exists"}, \
                status.HTTP_403_FORBIDDEN

        new_user = User(email=email,
                        name=name,
                        password=generate_password_hash(password,
                                                        method='sha256'))

        # add the new user to the database
        db.session.add(new_user)
        db.session.commit()

    return {"message": "POST email, name, and password to this API"}
