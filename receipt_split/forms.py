from flask_wtf import FlaskForm
from wtforms_alchemy import model_form_factory
from wtforms import fields, validators, Form

from .models import User, Receipt, ReceiptItem, Balance, Payment
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
                              [validators.length(min=1)])
    amount = fields.DecimalField("Decimal",
                                 [validators.NumberRange(min=0)])


class ReceiptForm(ModelForm):
    class Meta:
        model = Receipt

    name = fields.StringField("Name",
                              [validators.length(min=1)])
    amount = fields.DecimalField("Decimal",
                                 [validators.NumberRange(min=0)])
    receipt_items = fields.FieldList(fields.FormField(ReceiptItemForm))


class SignupForm(Form):
    name = fields.StringField("Username",
                              [validators.length(min=1)])
    fullname = fields.StringField("Full Name",
                                  [validators.length(min=1)])
    password = fields.PasswordField("Username",
                                    [validators.DataRequired(),
                                     validators.length(min=8),
                                     validators.EqualTo("confirm",
                                                        message="Passwords " +
                                                        "must match")])
    confirm = fields.PasswordField("Repeat Password")


class BalanceForm(ModelForm):
    class Meta:
        model = Balance


class Payment(ModelForm):
    class Meta:
        model = Payment
