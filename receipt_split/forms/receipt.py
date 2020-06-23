from flask_wtf import FlaskForm
from wtforms_alchemy import model_form_factory
from wtforms import fields, validators as va

from receipt_split.models import Receipt, ReceiptItem, Balance
from . import ModelForm

BaseModelForm = model_form_factory(FlaskForm)


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


class BalanceForm(ModelForm):
    class Meta:
        model = Balance
