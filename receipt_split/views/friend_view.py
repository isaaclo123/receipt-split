from flask import request, current_app as app
from flask_api import status
from flask_jwt import current_identity, jwt_required
from sqlalchemy.sql import exists, and_, expression

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

    if db.session.query(expression.literal(True)).filter(
        db.session.query(Friend)
        .filter(
            Friend.from_user_id == current_identity.id,
            Friend.to_user_id == friend.id,
            Friend.accepted.is_(None)
        )
        .exists()
    ).scalar():
        return err("Friend request already sent"), status.HTTP_404_NOT_FOUND

    friend_request = Friend(from_user=current_identity, to_user=friend)

    db.session.add(friend_request)
    db.session.commit()

    friend_dump = friend_schema.dump(friend_request)

    app.logger.info("/friend/%s request for %s - ",
                    current_identity.username, friend_dump)

    return friend_dump, status.HTTP_200_OK


@views.route('/friends', methods=['GET', 'PUT'])
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

    if request.method == 'PUT':
        Friend.archive_sent(current_identity)

    return friend_result, status.HTTP_200_OK


@views.route('/friends/<int:id>')
@views.route('/friends/<int:id>/<action>', methods=["GET", "POST"])
@jwt_required()
def friends(id, action=None):
    friend = Friend.query.get(id)

    if not friend:
        app.logger.info("/friend/%s NOT FOUND", id)
        return err("friend not found"), \
            status.HTTP_404_NOT_FOUND

    if friend.to_user_id != current_identity.id:
        app.logger.info("/friend/%s from_user incorrect", id)
        return err("you are not authorized to add friends from this user"), \
            status.HTTP_401_UNAUTHORIZED

    if friend.from_user_id == current_identity.id:
        app.logger.info("/friend/%s can't friend self", id)
        return err("Cannot friend self"), status.HTTP_401_UNAUTHORIZED

    if not db.session.query(exists().where(
                            User.id == friend.to_user_id)).scalar():
        return err("User to friend not found"), status.HTTP_404_NOT_FOUND

    if action is None and request.method == 'GET':
        friend_dump = friend_schema.dump(friend)
        return friend_dump

    # accept or reject bahavior after

    if (action == "accept" or action == "reject") and request.method == 'POST':
        # change accepted value

        if action == "accept":
            if friend.accept():
                db.session.commit()

        if action == "reject":
            if friend.reject():
                db.session.commit()

        friend_dump = friend_schema.dump(friend)
        return friend_dump

    return err("Should not get here"), status.HTTP_500_INTERNAL_SERVER_ERROR
