from marshmallow import fields

from receipt_split.models import User
from . import BaseSchema

USER_INFO_FIELDS = ('id', 'fullname', 'username')


class UserSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = User
        fields = ('id', 'fullname', 'username')

    id = fields.Int(dump_only=True)
