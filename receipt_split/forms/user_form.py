from receipt_split.models import User

from . import ModelForm
from wtforms import fields, Form


class UserForm(ModelForm):
    class Meta:
        model = User


class UserSummaryForm(Form):
    id = fields.IntegerField()
    username = fields.StringField()
    fullname = fields.StringField()
