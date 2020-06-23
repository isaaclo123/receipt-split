from marshmallow import Schema, fields

from receipt_split.meta import ma
from . import UserSchema, BalanceSchema, USER_INFO_FIELDS


class BalanceSumSchema(Schema):
    user = ma.Nested(UserSchema, include=USER_INFO_FIELDS, dump_only=True)
    owed_amount = fields.Decimal(dump_only=True)
    paid_amount = fields.Decimal(dump_only=True)
    balances = ma.Nested(BalanceSchema, many=True, dump_only=True,
                         exclude=('from_user', 'to_user'))
