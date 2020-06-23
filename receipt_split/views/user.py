from flask import current_app as app
from flask_api import status
from flask_jwt import current_identity, jwt_required

from receipt_split.schemas import user_schema
from . import views, err


@views.route('/user', methods=['GET'])
@jwt_required()
def user():
    if current_identity is None:
        return err("Invalid User"), status.HTTP_404_NOT_FOUND

    user_dump = user_schema.dump(current_identity)
    app.logger.info("user_dump %s", user_dump)

    return user_dump
