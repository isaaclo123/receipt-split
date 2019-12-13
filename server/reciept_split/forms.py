from flask_wtf import FlaskForm
from wtforms_alchemy import model_form_factory

from .models import User, Reciept, RecieptItem, Balance, Payment
from .meta import db

BaseModelForm = model_form_factory(FlaskForm)


class ModelForm(BaseModelForm):
    @classmethod
    def get_session(self):
        return db.session


class UserForm(ModelForm):
    class Meta:
        model = User


class RecieptForm(ModelForm):
    class Meta:
        model = Reciept


class RecieptItemForm(ModelForm):
    class Meta:
        model = RecieptItem


class BalanceForm(ModelForm):
    class Meta:
        model = Balance


class Payment(ModelForm):
    class Meta:
        model = Payment
