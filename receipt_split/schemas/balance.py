from marshmallow import fields, post_load

from receipt_split.models import Balance
from receipt_split.meta import ma
from . import BaseSchema, UserSchema, get_existing_user


USER_INFO_FIELDS = ('id', 'fullname', 'username')
RECEIPT_INFO_EXCLUDE_FIELDS = ('receipt_items', 'balances', 'users')


class BalanceSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = Balance
        fields = ('id', 'to_user', 'from_user', 'amount', 'receipt_name',
                  'receipt_id', 'paid')

    to_user = ma.Nested(UserSchema)
    from_user = ma.Nested(UserSchema)
    receipt_name = fields.String(dump_only=True)

    @post_load(pass_original=True)
    def get_existing_user(self, data, original_data, **kwargs):
        touser = get_existing_user(self, data, original_data,
                                   user_field="to_user", **kwargs)
        fromuser = get_existing_user(self, touser, original_data,
                                     user_field="from_user", **kwargs)
        return fromuser
