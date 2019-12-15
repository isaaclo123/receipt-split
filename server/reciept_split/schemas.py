from marshmallow import EXCLUDE, fields, pre_load, post_load
from .models import User, Reciept, RecieptItem, Balance, Payment

from .meta import ma, db
# db

user_info_fields = ('id', 'fullname', 'username')


def get_existing_user(self, data, original_data, **kwargs):
    print(original_data.get("user"))
    print(data.get("user"))
    user = original_data.get("user")

    print("USERJKyy")
    print(user)
    print("USERJKyy")

    q_id = user.get("id")
    q_username = user.get("username")
    print("Q_ID------------------------------")
    print(q_id)
    print(q_id)
    print("Q_ID------------------------------")

    if q_id is not None:
        exist_user = User.query.get(q_id)
        if exist_user is not None:
            data["user"] = exist_user
            return data
    elif q_username is not None:
        exist_user = User.query.filter_by(username=q_username).first()
        if exist_user is not None:
            data["user"] = exist_user
            return data

    data["users"] = user
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

        if q_id is not None:
            exist_user = User.query.get(q_id)
            if exist_user is not None:
                newusers = newusers + [exist_user]
                continue
        elif q_username is not None:
            exist_user = User.query.filter_by(username=q_username).first()
            if exist_user is not None:
                newusers = newusers + [exist_user]
                continue

    data["users"] = newusers
    return data


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


class UserSimpleSchema(ma.ModelSchema):
    class Meta:
        model = User
        fields = ('id', 'fullname', 'username')
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)


class BalanceSchema(ma.ModelSchema):
    class Meta:
        model = Balance
        fields = ('id', 'to_user', 'from_user', 'amount')


class RecieptItemSchema(ma.ModelSchema):
    class Meta:
        model = RecieptItem
        fields = ('name', 'amount', 'users')

    users = ma.Nested(UserSimpleSchema,
                      many=True)

    @post_load(pass_original=True)
    def get_existing_users(self, data, original_data, **kwargs):
        return get_existing_users(self, data, original_data, **kwargs)


class RecieptSchema(ma.ModelSchema):
    class Meta:
        model = Reciept
        fields = ('id', 'name', 'amount', 'date', 'resolved',
                  'balances', 'reciept_items', 'users', 'user')
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)

    balances = ma.Nested(BalanceSchema, many=True,
                         include=('name', 'amount'))
    reciept_items = ma.Nested(RecieptItemSchema, many=True)
    user = ma.Nested(UserSimpleSchema)

    users = ma.Nested(UserSimpleSchema, many=True)

    @post_load(pass_original=True)
    def get_existing_users(self, data, original_data, **kwargs):
        datawithusers = get_existing_users(self, data, original_data, **kwargs)
        print("USERUSERJky")
        print(datawithusers.get("users"))
        print(datawithusers.get("user"))
        print("USERUSERJky")
        datawithuser = get_existing_user(self, datawithusers,
                                         original_data, **kwargs)
        return datawithuser

    to_user = ma.Nested(UserSchema, include=user_info_fields)
    from_user = ma.Nested(UserSchema, include=user_info_fields)


class PaymentSchema(ma.ModelSchema):
    class Meta:
        model = Payment
        fields = ('id', 'to_user', 'from_user', 'amount')
        unknown = "EXCLUDE"

    to_user = ma.Nested(UserSchema, include=user_info_fields)
    from_user = ma.Nested(UserSchema, include=user_info_fields)
