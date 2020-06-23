from flask import current_app as app
from flask_api import status
from flask_jwt import current_identity, jwt_required

from receipt_split.models import Friend, User
from receipt_split.schemas import friend_schema, friends_schema, users_schema
from receipt_split.meta import db
from . import create_view, Call, View, get_model_view, accept_reject_view,\
    is_authorized, views, err


@views.route('/friend/<username>', methods=['POST'])
@jwt_required()
def friend_add(username):
    friend = User.query.filter_by(username=username).first()

    if friend is None:
        app.logger.info("/friend/%s does not exist - %s", username,
                        current_identity.username)
        return err("friend does not exist"), status.HTTP_400_BAD_REQUEST

    if friend == current_identity:
        app.logger.info("/friend/%s is self - %s", username,
                        current_identity.username)
        return err("cannot friend yourself"), status.HTTP_400_BAD_REQUEST

    if friend in current_identity.friends:
        return err("friend already added"), status.HTTP_400_BAD_REQUEST

    friend_request = Friend(from_user=current_identity, to_user=friend)

    db.session.add(friend_request)
    db.session.commit()

    friend_dump = friend_schema.dump(friend_request)

    app.logger.info("/friend/%s request for %s - ",
                    current_identity.username, friend_dump)

    return friend_dump, status.HTTP_200_OK


@views.route('/friends', methods=['GET'])
@jwt_required()
def friend_list():
    friends = users_schema.dump(current_identity.friends)
    friends_received = friends_schema.dump(
        Friend.get_received(current_identity)
    )
    friends_sent = friends_schema.dump(
        Friend.get_sent(current_identity)
    )
    app.logger.info("/friend list get - %s - %s", current_identity.username,
                    friends)

    friend_result = {
        "friends_received": friends_received,
        "friends_sent": friends_sent,
        "friends": friends
    }

    Friend.archive_sent(current_identity)

    return friend_result, status.HTTP_200_OK


@views.route('/friends/<int:id>')
@views.route('/friends/<int:id>/<action>', methods=["GET", "POST"])
@jwt_required()
def friends(id, action=None):
    return create_view([
        View(
            methods=["GET"],
            calls=[
                Call(
                    func=is_authorized,
                    args=[["to_user", "from_user"]]
                ),
                Call(
                    func=get_model_view,
                )
            ]
        ),
        View(
            methods=["POST"],
            calls=[
                Call(
                    func=is_authorized,
                    args=[["to_user"]]
                ),
                Call(
                    func=accept_reject_view,
                    args=[action]
                ),
                Call(
                    func=get_model_view,
                )
            ]
        )
        ],
        obj=Friend.query.get(id),
        schema=friend_schema
    )
