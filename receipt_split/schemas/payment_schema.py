from flask import current_app as app

from marshmallow import post_load
from receipt_split.models import Payment
from receipt_split.meta import ma
from . import BaseSchema, UserSchema, get_existing_user, USER_INFO_FIELDS


class PaymentSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = Payment
        fields = ('id', 'to_user', 'from_user', 'amount', 'message', 'date',
                  'accepted')

    date = ma.Date(dump_only=True)
    to_user = ma.Nested(UserSchema, include=USER_INFO_FIELDS)
    from_user = ma.Nested(UserSchema, include=USER_INFO_FIELDS)

    @post_load(pass_original=True)
    def get_existing_user(self, data, original_data, **kwargs):
        touser = get_existing_user(self, data, original_data,
                                   user_field="to_user", **kwargs)
        fromuser = get_existing_user(self, touser, original_data,
                                     user_field="from_user", **kwargs)
        app.logger.debug("GET EXISTING USER END PAYMENT_SCHEMA")
        return fromuser
