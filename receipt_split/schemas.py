from flask import current_app as app
from marshmallow import EXCLUDE, fields, post_load, Schema
from .models import User, Receipt, ReceiptItem, Balance, Payment, Friend

from .meta import ma, db
# db

USER_INFO_FIELDS = ('id', 'fullname', 'username')
RECEIPT_INFO_EXCLUDE_FIELDS = ('receipt_items', 'balances', 'users')


class BaseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        unknown = EXCLUDE
        load_instance = True
        sqla_session = db.session


def get_existing_user(self, data, original_data, user_field="user", **kwargs):
    app.logger.debug("get existing user")
    if original_data is None:
        app.logger.debug("original data is NONE")
        return None

    app.logger.debug("original data exists")

    user = original_data.get(user_field)

    if user is None:
        app.logger.debug("user data is NONE")
        return None
    app.logger.debug("GOT ID AND USERNAME")

    q_id = user.get("id")
    q_username = user.get("username")

    app.logger.debug("GOT ID AND USERNAME")
    app.logger.debug("id %s; username %s", q_id, q_username)

    exist_user = None

    if q_id is not None:
        exist_user = User.query.get(q_id)
    elif q_username is not None:
        exist_user = User.query.filter_by(username=q_username).first()

    if exist_user is None:
        return data

    data[user_field] = exist_user
    app.logger.debug("user is %s", exist_user)
    app.logger.debug("end get existing user")

    return data


def get_existing_users(self, data, original_data, **kwargs):
    if original_data is None:
        return []

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
#
#
# class FriendSchema(BaseSchema):
#     class Meta(BaseSchema.Meta):
#         model = User
#         fields = ('id', 'fullname', 'username')


class UserSchema(BaseSchema):
    # friends = ma.Nested(FriendSchema, many=True, include=USER_INFO_FIELDS)

    # balances_to_user = ma.Nested(BalanceSchema, many=True)
    # balances_from_user = ma.Nested(BalanceSchema, many=True)
    class Meta(BaseSchema.Meta):
        model = User
        fields = ('id', 'fullname', 'username')

    id = fields.Int(dump_only=True)


class BalanceSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = Balance
        fields = ('id', 'to_user', 'from_user', 'amount', 'receipt_name',
                  'receipt_id')

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


class ReceiptItemSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = ReceiptItem
        fields = ('name', 'amount', 'users')

    users = ma.Nested(UserSchema,
                      many=True)

    @post_load(pass_original=True)
    def get_existing_users(self, data, original_data, **kwargs):
        return get_existing_users(self, data, original_data, **kwargs)


class ReceiptSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = Receipt
        fields = ('id', 'name', 'amount', 'date', 'resolved',
                  'balances', 'receipt_items', 'users', 'user')
        ordered = True

    id = fields.Int()

    resolved = ma.Boolean(dump_only=True)
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

    to_user = ma.Nested(UserSchema, include=USER_INFO_FIELDS)
    from_user = ma.Nested(UserSchema, include=USER_INFO_FIELDS)


class ReceiptCreateSchema(ReceiptSchema):
    id = fields.Int(dump_only=True)


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


class FriendSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = Friend
        fields = ('id', 'to_user', 'from_user', 'accepted', 'archived')

    to_user = ma.Nested(UserSchema)
    from_user = ma.Nested(UserSchema)


class BalanceSumSchema(Schema):
    user = ma.Nested(UserSchema, include=USER_INFO_FIELDS, dump_only=True)
    owed_amount = fields.Decimal(dump_only=True)
    paid_amount = fields.Decimal(dump_only=True)
    # receipts = ma.Nested(ReceiptSchema, many=True, dump_only=True,
    #                      exclude=RECEIPT_INFO_EXCLUDE_FIELDS)
    balances = ma.Nested(BalanceSchema, many=True, dump_only=True,
                         exclude=('from_user', 'to_user'))
