from receipt_split.models import Friend
from receipt_split.meta import ma
from . import BaseSchema, UserSchema

USER_INFO_FIELDS = ('id', 'fullname', 'username')


class FriendSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = Friend
        fields = ('id', 'to_user', 'from_user', 'accepted', 'archived')

    to_user = ma.Nested(UserSchema)
    from_user = ma.Nested(UserSchema)
