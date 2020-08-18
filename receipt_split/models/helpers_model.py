from receipt_split.meta import db

# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.ext.associationproxy import association_proxy
from flask import current_app as app
from sqlalchemy.ext.declarative import declared_attr


class Base(db.Model):
    # @declared_attr
    # def __tablename__(cls):
    #     return cls.__name__.lower()
    __abstract__ = True

    created_on = db.Column(db.DateTime(), default=db.func.now())
    updated_on = db.Column(db.DateTime(), default=db.func.now(),
                           onupdate=db.func.now())

    @declared_attr
    def __mapper_args__(cls):
        return {
            "order_by": cls.created_on.desc()
        }


class OwnedMixin(object):
    # payer
    @declared_attr
    def from_user_id(cls):
        return db.Column(db.Integer, db.ForeignKey('user.id'))
    # payee

    @declared_attr
    def to_user_id(cls):
        return db.Column(db.Integer, db.ForeignKey('user.id'))


class RequestMixin(OwnedMixin, object):
    accepted = db.Column(db.Boolean)
    archived_from = db.Column(db.Boolean, default=False, nullable=False)
    archived_to = db.Column(db.Boolean, default=False, nullable=False)

    @classmethod
    def get_received(cls, user):
        return cls.query.filter_by(
            # accepted=None,
            to_user_id=user.id,
            archived_to=False
        )

    @classmethod
    def get_sent(cls, user):
        return cls.query.filter_by(
            from_user_id=user.id,
            archived_from=False
        )

    @classmethod
    def archive_sent(cls, user):
        # archive payments not archived yet which are not in "pending" state
        # (null)
        cls.query.filter(
            cls.from_user_id == user.id,
            cls.archived_from.is_(False),
            cls.accepted.isnot(None)
        ).update({"archived_from": True})

        cls.query.filter(
            cls.to_user_id == user.id,
            cls.archived_to.is_(False),
            cls.accepted.isnot(None)
        ).update({"archived_to": True})

        db.session.commit()

    def accept(self, callback=lambda: None):
        app.logger.debug("accepted for %s is %s", self.id, self.accepted)
        if self.accepted is False or self.accepted is None:
            # False means payment was previously rejected
            # None means payment has not been accepted or rejected yet
            # rejected or not added yet

            # in this case, we add the payment to the settlement
            # from user -> to user

            # TODO exception id settlement none
            callback()

            # unarchive
            self.archived_from = False
            self.archived_to = False
            self.accepted = True

            return True

        return False

    def reject(self, callback=lambda: None):
        if self.accepted is True:
            # True means payment was previously accepted
            # if payment was previously accepted, we have to remove payment
            # value

            # in this case, we remove the previously added payment to the
            # settlement from user -> to user
            # s = self.from_user.get_settlement_to(self.to_user)

            # TODO exception id settlement none
            callback()

            # unarchive
            self.archived_from = False
            self.archived_to = False
            self.accepted = False

            return True

        if self.accepted is None:
            # None means payment is new
            self.accepted = False
            return True

        return False
