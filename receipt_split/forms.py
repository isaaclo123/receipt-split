from flask_wtf import FlaskForm
from wtforms_alchemy import model_form_factory
from wtforms import fields, validators as va, Form

from .models import User, Receipt, ReceiptItem, Balance, Payment,\
    MAX_MESSAGE_LENGTH
from .meta import db

BaseModelForm = model_form_factory(FlaskForm)


class ModelForm(BaseModelForm):
    @classmethod
    def get_session(self):
        return db.session


class UserForm(ModelForm):
    class Meta:
        model = User


class ReceiptItemForm(ModelForm):
    class Meta:
        model = ReceiptItem

    name = fields.StringField("Name",
                              [va.length(min=1)])
    amount = fields.DecimalField("Decimal", [va.NumberRange(min=0)])


class ReceiptForm(ModelForm):
    class Meta:
        model = Receipt

    name = fields.StringField("Name",
                              [va.length(min=1)])
    amount = fields.DecimalField("Decimal", [va.NumberRange(min=0)])
    receipt_items = fields.FieldList(fields.FormField(ReceiptItemForm))


class SignupForm(Form):
    username = fields.StringField("Username",
                                  [va.DataRequired(), va.length(min=1)])
    fullname = fields.StringField("Full Name",
                                  [va.DataRequired(), va.length(min=1)])
    password = fields.PasswordField("Username",
                                    [va.DataRequired(), va.length(min=8),
                                     va.EqualTo("confirm",
                                                message="Passwords must match")
                                     ])
    confirm = fields.PasswordField("Repeat Password", [va.DataRequired()])


class BalanceForm(ModelForm):
    class Meta:
        model = Balance


class PaymentForm(ModelForm):
    class Meta:
        model = Payment

    message = fields.StringField("Message", [va.length(min=1,
                                                       max=MAX_MESSAGE_LENGTH
                                                       )])
    amount = fields.DecimalField("Decimal", [va.NumberRange(min=0)])
    to_user = fields.FormField(UserForm, [va.DataRequired()])
