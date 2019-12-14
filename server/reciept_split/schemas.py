# from marshmallow_sqlalchemy import ModelSchema
from .models import User, Reciept, RecieptItem, Balance, Payment

from .meta import ma
# db

user_info_fields = ('id', 'fullname', 'username')


class FriendSchema(ma.ModelSchema):
    class Meta:
        model = User
        fields = ('id', 'fullname', 'username')


class UserSchema(ma.ModelSchema):
    class Meta:
        model = User
        fields = ('id', 'fullname', 'username', 'friends',
                  'balances_to_user', 'balances_from_user', 'payments_to_user',
                  'payments_from_user')

    friends = ma.Nested(FriendSchema, many=True, include=user_info_fields)


class RecieptItemSchema(ma.ModelSchema):
    class Meta:
        model = RecieptItem
        fields = ('id', 'name', 'amount', 'reciept')


class RecieptSchema(ma.ModelSchema):
    class Meta:
        model = Reciept
        fields = ('id', 'name', 'amount', 'date', 'resolved',
                  'balances', 'reciept_items', 'users', 'user')

    user = ma.Nested(UserSchema, include=user_info_fields)
    users = ma.Nested(UserSchema, many=True, include=user_info_fields)

    reciept_items = ma.Nested(RecieptItemSchema,
                              many=True,
                              include=('id', 'name', 'amount'))


class BalanceSchema(ma.ModelSchema):
    class Meta:
        model = Balance
        fields = ('id', 'to_user', 'from_user', 'amount')

    to_user = ma.Nested(UserSchema, include=user_info_fields)
    from_user = ma.Nested(UserSchema, include=user_info_fields)


class PaymentSchema(ma.ModelSchema):
    class Meta:
        model = Payment
        fields = ('id', 'to_user', 'from_user', 'amount')

    to_user = ma.Nested(UserSchema, include=user_info_fields)
    from_user = ma.Nested(UserSchema, include=user_info_fields)
