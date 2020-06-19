from .meta import db

# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.ext.associationproxy import association_proxy
from flask import current_app as app
from sqlalchemy.orm import relationship, column_property, object_session
from sqlalchemy.sql import func, select, expression
from sqlalchemy import and_, exists, or_, literal_column

from datetime import date, datetime

# from decimal import Decimal

MAX_MESSAGE_LENGTH = 300

friendship = db.Table(
    'friendships', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), index=True),
    db.Column('friend_id', db.Integer, db.ForeignKey('user.id')),
    db.UniqueConstraint('user_id', 'friend_id', name='unique_friendships'))


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


class Payment(db.Model):
    __tablename__ = 'payment'
    id = db.Column(db.Integer, primary_key=True)

    date = db.Column(db.DateTime(), default=datetime.utcnow(), nullable=False)

    # true is accepted, false is not accepted, null is not accepted or rejected
    accepted = db.Column(db.Boolean)
    archived = db.Column(db.Boolean, default=False, nullable=False)
    message = db.Column(db.String(MAX_MESSAGE_LENGTH))

    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # to_user
    # from_user

    amount = db.Column(db.Float(asdecimal=True), nullable=False)

    # methods return True if modified, else False

    def accept(self):
        app.logger.debug("accepted for %s is %s", self.id, self.accepted)
        if self.accepted is False or self.accepted is None:
            # False means payment was previously rejected
            # None means payment has not been accepted or rejected yet
            # rejected or not added yet

            # in this case, we add the payment to the settlement
            # from user -> to user

            # TODO exception id settlement none
            s = Settlement.query.get({
                "user_id": self.from_user_id,
                "to_user_id": self.to_user_id
            })
            s.add_payment(self)

            # unarchive
            self.archived = False
            self.accepted = True

            return True

        return False

    def reject(self):
        if self.accepted is True:
            # True means payment was previously accepted
            # if payment was previously accepted, we have to remove payment
            # value

            # in this case, we remove the previously added payment to the
            # settlement from user -> to user
            # s = self.from_user.get_settlement_to(self.to_user)

            s = Settlement.query.get({
                "user_id": self.from_user_id,
                "to_user_id": self.to_user_id
            })
            s.remove_payment(self)

            # unarchive
            self.archived = False

            self.accepted = False

            return True

        if self.accepted is None:
            # None means payment is new
            self.accepted = False
            return True

        return False


class ReceiptItem(db.Model):
    __tablename__ = 'receiptitem'
    id = db.Column(db.Integer, primary_key=True)

    receipt_id = db.Column(db.Integer, db.ForeignKey('receipt.id'))

    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float(asdecimal=True),
                       nullable=False)

    # users = relationship("ReceiptItem",
    #                      # backref="receipt_items",
    #                      foreign_keys=[User.receipt_item_id])
    # receipt


class Receipt(db.Model):
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


class Balance(db.Model):
    __tablename__ = 'balance'
    id = db.Column(db.Integer, primary_key=True)

    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # to_user
    # from_user

    # settlement_id = column_property(
    #     expression.cast(from_user_id, db.String) +
    #     "-" +
    #     expression.cast(to_user_id, db.String)
    # )

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


class Settlement(db.Model):
    __tablename__ = 'settlement'
    __table_args__ = (
        db.CheckConstraint('user_id <> to_user_id'),
        # db.UniqueConstraint('user_id', 'to_user_id'),
    )

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True,
                        nullable=False)
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                           primary_key=True, nullable=False)

    # id = column_property(
    #     expression.cast(user_id, db.String) +
    #     "-" +
    #     expression.cast(to_user_id, db.String)
    # )

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
            from_user_id=self.user_id,
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


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)

    # friend_of

    friends = relationship('User',
                           secondary=friendship,
                           primaryjoin=id == friendship.c.user_id,
                           secondaryjoin=id == friendship.c.friend_id)

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

    settlements_owned = relationship("Settlement",
                                     foreign_keys=[Settlement.user_id],
                                     backref="user")

    receipt_items = relationship("ReceiptItem",
                                 secondary=receiptitem_association_table,
                                 backref="users")

    # receipts_owed = column_property(
    #     select(
    #         Receipt,
    #         id == Receipt.user_id
    #     ).label('receipts_owed')
    # )

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

    def add_friend(self, friend):
        if friend.id == self.id:
            return

        if friend not in self.friends:
            self.friends.append(friend)
            friend.friends.append(self)

        # add neccesary settlement objects
        if Settlement.query.get({
            "user_id": self.id,
            "to_user_id": friend.id
                }) is None:
            self.settlements_owned.append(
                Settlement(
                    user_id=self.id,
                    to_user_id=friend.id,
                    paid_amount=0.0,
                    owed_amount=0.0,
                )
            )

        if Settlement.query.get({
            "user_id": friend.id,
            "to_user_id": self.id
                }) is None:
            friend.settlements_owned.append(
                Settlement(
                    user_id=friend.id,
                    to_user_id=self.id,
                    paid_amount=0.0,
                    owed_amount=0.0,
                )
            )

    def delete_friend(self, friend):
        if friend in self.friends:
            self.friends.remove(friend)
            friend.friends.remove(self)
