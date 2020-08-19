from wtforms import fields, validators as va, Form

from receipt_split.models import MAX_MESSAGE_LENGTH
from . import UserSummaryForm


class PaymentForm(Form):
    message = fields.StringField("Message", [va.length(min=1,
                                                       max=MAX_MESSAGE_LENGTH
                                                       )])
    amount = fields.DecimalField("Decimal", [va.NumberRange(min=0.01)])
    to_user = fields.FormField(UserSummaryForm)
