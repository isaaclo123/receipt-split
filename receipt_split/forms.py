from flask_wtf import FlaskForm
from wtforms_alchemy import model_form_factory
from wtforms import fields, validators

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


class BalanceForm(ModelForm):
    class Meta:
        model = Balance


class Payment(ModelForm):
    class Meta:
        model = Payment
