from flask_wtf import FlaskForm
from wtforms_alchemy import model_form_factory

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


class ReceiptForm(ModelForm):
    class Meta:
        model = Receipt


class ReceiptItemForm(ModelForm):
    class Meta:
        model = ReceiptItem


class BalanceForm(ModelForm):
    class Meta:
        model = Balance


class Payment(ModelForm):
    class Meta:
        model = Payment
