from wtforms import fields, validators as va

from receipt_split.models import Receipt, ReceiptItem
from . import ModelForm


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
