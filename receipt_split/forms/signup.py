from wtforms import fields, validators as va, Form


class SignupForm(Form):
    username = fields.StringField("Username",
                                  [va.DataRequired(), va.length(min=1)])
    fullname = fields.StringField("Full Name",
                                  [va.DataRequired(), va.length(min=1)])
    password = fields.PasswordField("Username",
                                    [va.DataRequired(),
                                     va.length(min=1),  # TODO
                                     va.EqualTo("confirm",
                                                message="Passwords must match")
                                     ])
    confirm = fields.PasswordField("Repeat Password", [va.DataRequired()])
