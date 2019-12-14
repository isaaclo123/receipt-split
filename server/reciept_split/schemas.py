# from marshmallow_sqlalchemy import ModelSchema
from .models import User, Reciept, RecieptItem, Balance, Payment

from .meta import ma
# db


class UserSchema(ma.ModelSchema):
    class Meta:
        model = User


class RecieptSchema(ma.ModelSchema):
    class Meta:
        model = Reciept
        fields = ('id', 'name', 'amount', 'date', 'resolved',
                  'balances', 'reciept_items', 'users', 'user')


class RecieptItemSchema(ma.ModelSchema):
    class Meta:
        model = RecieptItem


class BalanceSchema(ma.ModelSchema):
    class Meta:
        model = Balance


class PaymentSchema(ma.ModelSchema):
    class Meta:
        model = Payment
