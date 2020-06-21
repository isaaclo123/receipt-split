from .meta import db

# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.ext.associationproxy import association_proxy
from flask import current_app as app
from sqlalchemy.orm import relationship, column_property, object_session
from sqlalchemy.sql import func, select, expression
from sqlalchemy import and_, exists, or_, literal_column
from sqlalchemy.ext.declarative import declared_attr, declarative_base

from datetime import date, datetime

# from decimal import Decimal

MAX_MESSAGE_LENGTH = 300
#
# friendship = db.Table(
#     'friendships', db.metadata,
#     db.Column('user_id', db.Integer, db.ForeignKey('user.id'), index=True),
#     db.Column('friend_id', db.Integer, db.ForeignKey('user.id')),
#     db.UniqueConstraint('user_id', 'friend_id', name='unique_friendships'))


receiptitem_association_table = db.Table(
    'user_receiptitem_association',
    db.metadata,
    db.Column('left_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('right_id', db.Integer, db.ForeignKey('receiptitem.id'))
)

receipt_association_table = db.Table(
    'user_receipt_association',
    db.metadata,
    db.Column('left_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('right_id', db.Integer, db.ForeignKey('receipt.id'))
)


class Base(db.Model):
    # @declared_attr
    # def __tablename__(cls):
    #     return cls.__name__.lower()
    __abstract__ = True

    created_on = db.Column(db.DateTime(), default=db.func.now())
    updated_on = db.Column(db.DateTime(), default=db.func.now(),
                           onupdate=db.func.now())


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
    archived = db.Column(db.Boolean, default=False, nullable=False)

    @classmethod
    def get_received(cls, user):
        return cls.query.filter_by(
            accepted=None,
            to_user_id=user.id,
            archived=False
        ).all()

    @classmethod
    def get_sent(cls, user):
        sent = cls.query.filter_by(
            from_user_id=user.id,
            archived=False
        )

        # archive payments not archived yet which are not in "pending" state
        # (null)
        sent.filter(
            cls.accepted.isnot(None)
        ).update({"archived": True})

        db.session.commit()

        return sent

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
            self.archived = False
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
            self.archived = False
            self.accepted = False

            return True

        if self.accepted is None:
            # None means payment is new
            self.accepted = False
            return True

        return False


class Friend(RequestMixin, Base):
    __tablename__ = 'friend'

    id = db.Column(db.Integer, primary_key=True)

    # to_user_id
    # from_user_id

    def accept(self):
        def callback():
            # add settlement objects for each user in the friendrequest on
            # accept
            if Settlement.query.get({
                "from_user_id": self.from_user_id,
                "to_user_id": self.to_user_id
                    }) is None:
                db.session.add(
                    Settlement(
                        from_user_id=self.from_user_id,
                        to_user_id=self.to_user_id,
                        paid_amount=0.0,
                        owed_amount=0.0,
                    )
                )

            if Settlement.query.get({
                "from_user_id": self.to_user_id,
                "to_user_id": self.from_user_id
                    }) is None:
                db.session.add(
                    Settlement(
                        from_user_id=self.to_user_id,
                        to_user_id=self.from_user_id,
                        paid_amount=0.0,
                        owed_amount=0.0,
                    )
                )

        return super().accept(callback=callback)


class Payment(RequestMixin, Base):
    __tablename__ = 'payment'

    id = db.Column(db.Integer, primary_key=True)

    date = db.Column(db.DateTime(), default=datetime.utcnow(), nullable=False)

    # accepted
    # archived

    message = db.Column(db.String(MAX_MESSAGE_LENGTH))

    # to_user_id
    # from_user_id
    # to_user
    # from_user

    amount = db.Column(db.Float(asdecimal=True), nullable=False)

    # methods return True if modified, else False
    def accept(self):
        def callback():
            s = Settlement.query.get({
                "from_user_id": self.from_user_id,
                "to_user_id": self.to_user_id
            })
            s.add_payment(self)

        return super().accept(callback=callback)

    def reject(self):
        def callback():
            s = Settlement.query.get({
                "from_user_id": self.from_user_id,
                "to_user_id": self.to_user_id
            })
            s.remove_payment(self)

        return super().reject(callback=callback)


class ReceiptItem(Base):
    __tablename__ = 'receiptitem'

    id = db.Column(db.Integer, primary_key=True)

    receipt_id = db.Column(db.Integer, db.ForeignKey('receipt.id'))

    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float(asdecimal=True),
                       nullable=False)


class Receipt(Base):
    __tablename__ = 'receipt'
    # user

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False, default="New Receipt")
    amount = db.Column(db.Float(asdecimal=True),
                       nullable=False, default=0)
    date = db.Column(db.Date,
                     default=date.today(),
                     nullable=False)

    resolved = db.Column(db.Boolean)

    # user
    # users

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    balances = relationship("Balance", backref="receipt",
                            cascade="all,delete-orphan")

    receipt_items = relationship("ReceiptItem", backref="receipt",
                                 foreign_keys=[ReceiptItem.receipt_id],
                                 cascade="all,delete-orphan")


class Balance(OwnedMixin, Base):
    __tablename__ = 'balance'

    id = db.Column(db.Integer, primary_key=True)

    # to_user
    # from_user

    amount = db.Column(db.Float(asdecimal=True),
                       nullable=False)
    paid = db.Column(db.Boolean, nullable=False, default=False)

    receipt_id = db.Column(db.Integer, db.ForeignKey('receipt.id'))
    receipt_name = column_property(
        select(
            [Receipt.name]
        ).select_from(
            Receipt
        ).where(
            Receipt.id == receipt_id
        ).correlate_except(Receipt)
    )


class Settlement(Base):
    __tablename__ = 'settlement'
    __table_args__ = (
        db.CheckConstraint('from_user_id <> to_user_id'),
    )

    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                             primary_key=True, nullable=False)
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                           primary_key=True, nullable=False)

    # user
    # to_user

    paid_amount = db.Column(db.Float(asdecimal=True), nullable=False,
                            default=0.0)

    owed_amount = db.Column(db.Float(asdecimal=True), nullable=False,
                            default=0.0)

    def update_settlement(self):
        s = db.session.query(
            func.coalesce(func.sum(Balance.amount), literal_column("0.0"))
        ).filter_by(
            from_user_id=self.from_user_id,
            to_user_id=self.to_user_id
        ).as_scalar()

        app.logger.debug("------")
        app.logger.debug("settlement balance %s", s)
        app.logger.debug("settlement %s", self)
        app.logger.debug("------")

        self.owed_amount = s

    def add_payment(self, payment):
        # TODO
        self.paid_amount = self.paid_amount + payment.amount

    def remove_payment(self, payment):
        self.paid_amount = self.paid_amount - payment.amount


class User(Base):
    __tablename__ = 'user'
    # friend_of
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    fullname = db.Column(db.String(100), nullable=False)

    receipts_owned = relationship("Receipt", backref="user",
                                  cascade="merge,delete")

    receipts_in = relationship("Receipt",
                               secondary=receipt_association_table,
                               backref="users")

    balances_to_user = relationship("Balance",
                                    foreign_keys=[
                                        Balance.to_user_id
                                    ],
                                    backref="to_user")
    balances_from_user = relationship("Balance",
                                      foreign_keys=[
                                          Balance.from_user_id
                                      ],
                                      backref="from_user")

    payments_to_user = relationship("Payment",
                                    foreign_keys=[
                                        Payment.to_user_id
                                    ],
                                    backref="to_user")
    payments_from_user = relationship("Payment",
                                      foreign_keys=[
                                          Payment.from_user_id
                                      ],
                                      backref="from_user")

    settlements_to_user = relationship("Settlement",
                                       foreign_keys=[Settlement.to_user_id],
                                       backref="to_user")

    settlements_from_user = relationship("Settlement",
                                         foreign_keys=[
                                             Settlement.from_user_id
                                         ],
                                         backref="user")

    receipt_items = relationship("ReceiptItem",
                                 secondary=receiptitem_association_table,
                                 backref="users")

    friend_to_user = relationship("Friend",
                                  foreign_keys=[
                                      Friend.to_user_id
                                  ], backref="to_user")

    friend_from_user = relationship("Friend",
                                    foreign_keys=[
                                        Friend.from_user_id
                                    ], backref="from_user")

    @property
    def friends(self):
        friends_from = db.session.query(
            Friend.to_user_id.label("id")
        ).select_from(Friend).filter_by(
            from_user_id=self.id,
            accepted=True
        )

        friends_from_test = db.session.query(
            Friend.from_user_id.label("id")
        ).select_from(Friend).filter_by(
            from_user_id=self.id,
            accepted=True
        )
        app.logger.debug("%s's 'friends_from %s", self.username,
                         friends_from_test.all())

        friends_to = db.session.query(
            Friend.from_user.label("id")
        ).select_from(Friend).filter_by(
            to_user_id=self.id,
            accepted=True
        )

        all_friends_ids = friends_from.union(friends_to).subquery()

        all_friends = db.session.query(
            User
        ).select_from(
            all_friends_ids
        ).join(
            User,
            User.id == all_friends_ids.c.id
        )

        return all_friends

    @property
    def receipts_owed(self):
        result = Receipt.query.join(
            receipt_association_table,
        ).filter(
            receipt_association_table.c.left_id == self.id,
            Receipt.user_id != self.id
        )

        app.logger.info("receipts_owed expression running - %s", result)

        return result
