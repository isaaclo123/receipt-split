import os
from wtforms import fields, validators as va, Form


# allow short password for devel, else 8 char password
PASSWORD_MIN_LENGTH = 1 if os.environ.get('FLASK_ENV') == "development" else 8


class SignupForm(Form):
    username = fields.StringField("Username",
                                  [va.DataRequired(), va.length(min=1)])
    fullname = fields.StringField("Full Name",
                                  [va.DataRequired(), va.length(min=1)])
    password = fields.PasswordField("Password",
                                    [va.DataRequired(),
                                     va.length(
                                         min=PASSWORD_MIN_LENGTH
                                     ),  # TODO
                                     va.EqualTo("confirm",
                                                message="Passwords must match")
                                     ])
    confirm = fields.PasswordField("Repeat Password", [va.DataRequired()])
