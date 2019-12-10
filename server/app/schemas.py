from marshmallow_sqlalchemy import ModelSchema
from models import User, Reciept, RecieptItem, Balance, Payment


class UserSchema(ModelSchema):
    class Meta:
        model = User


class RecieptSchema(ModelSchema):
    class Meta:
        model = Reciept


class RecieptItemSchema(ModelSchema):
    class Meta:
        model = RecieptItem


class BalanceSchema(ModelSchema):
    class Meta:
        model = Balance


class PaymentSchema(ModelSchema):
    class Meta:
        model = Payment
