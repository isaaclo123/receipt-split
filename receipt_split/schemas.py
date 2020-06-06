from marshmallow import EXCLUDE, fields, pre_load, post_load
from .models import User, Receipt, ReceiptItem, Balance, Payment

from .meta import ma, db
# db

user_info_fields = ('id', 'fullname', 'username')


def get_existing_user(self, data, original_data, user_field="user", **kwargs):
    user = original_data.get(user_field)

    q_id = user.get("id")
    q_username = user.get("username")

    exist_user = None

    if q_id is not None:
        exist_user = User.query.get(q_id)
    elif q_username is not None:
        exist_user = User.query.filter_by(username=q_username).first()

    if exist_user is None:
        return data

    data[user_field] = exist_user

    return data


def get_existing_users(self, data, original_data, **kwargs):
    users = original_data.get("users")
    if not users:
        data["users"] = []
        return data

    newusers = []

    for u in users:
        q_id = u.get("id")
        q_username = u.get("username")

        exist_user = None

        if q_id is not None:
            exist_user = User.query.get(q_id)
        elif q_username is not None:
            exist_user = User.query.filter_by(username=q_username).first()

        if exist_user is None:
            continue

        newusers = newusers + [exist_user]

    data["users"] = newusers
    return data


class FriendSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        fields = ('id', 'fullname', 'username')
        load_instance = True


class UserSchema(ma.SQLAlchemyAutoSchema):
    # friends = ma.Nested(FriendSchema, many=True, include=user_info_fields)

    # balances_to_user = ma.Nested(BalanceSchema, many=True)
    # balances_from_user = ma.Nested(BalanceSchema, many=True)
    class Meta:
        model = User
        fields = ('id', 'fullname', 'username')
        unknown = EXCLUDE
        load_instance = True

    id = fields.Int(dump_only=True)


class BalanceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Balance
        fields = ('id', 'to_user', 'from_user', 'amount')
        unknown = EXCLUDE
        load_instance = True

    to_user = ma.Nested(UserSchema)
    from_user = ma.Nested(UserSchema)

    @post_load(pass_original=True)
    def get_existing_user(self, data, original_data, **kwargs):
        touser = get_existing_user(self, data, original_data,
                                   user_field="to_user", **kwargs)
        fromuser = get_existing_user(self, touser, original_data,
                                     user_field="from_user", **kwargs)
        return fromuser


class ReceiptItemSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ReceiptItem
        fields = ('name', 'amount', 'users')
        load_instance = True

    users = ma.Nested(UserSchema,
                      many=True)

    @post_load(pass_original=True)
    def get_existing_users(self, data, original_data, **kwargs):
        return get_existing_users(self, data, original_data, **kwargs)


class ReceiptSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Receipt
        fields = ('id', 'name', 'amount', 'date', 'resolved',
                  'balances', 'receipt_items', 'users', 'user')
        unknown = EXCLUDE
        ordered = True
        load_instance = True

    id = fields.Int()

    balances = ma.Nested(BalanceSchema, many=True)
    receipt_items = ma.Nested(ReceiptItemSchema, many=True)
    user = ma.Nested(UserSchema)

    users = ma.Nested(UserSchema, many=True)

    @post_load(pass_original=True)
    def get_existing_users(self, data, original_data, **kwargs):
        datawithusers = get_existing_users(self, data, original_data, **kwargs)
        datawithuser = get_existing_user(self, datawithusers,
                                         original_data, **kwargs)
        return datawithuser

    to_user = ma.Nested(UserSchema, include=user_info_fields)
    from_user = ma.Nested(UserSchema, include=user_info_fields)


class PaymentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Payment
        fields = ('id', 'to_user', 'from_user', 'amount')
        unknown = "EXCLUDE"
        load_instance = True

    to_user = ma.Nested(UserSchema, include=user_info_fields)
    from_user = ma.Nested(UserSchema, include=user_info_fields)