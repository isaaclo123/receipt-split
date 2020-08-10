from flask import current_app as app
from marshmallow import EXCLUDE

from receipt_split.models import User
from receipt_split.meta import ma, db

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
