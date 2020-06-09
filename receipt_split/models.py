# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import scoped_session, sessionmaker, relationship, backref
from datetime import date, datetime

# from decimal import Decimal

from .meta import db

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


class Balance(db.Model):
    __tablename__ = 'balance'
    id = db.Column(db.Integer, primary_key=True)

    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # to_user
    # from_user

    amount = db.Column(db.Float(asdecimal=True),
                       nullable=False)

    receipt_id = db.Column(db.Integer, db.ForeignKey('receipt.id'))


class Payment(db.Model):
    __tablename__ = 'payment'
    id = db.Column(db.Integer, primary_key=True)

    created = db.Column(db.DateTime(), default=datetime.utcnow(),
                        nullable=False)

    # true is accepted, false is not accepted, null is not accepted or rejected
    accepted = db.Column(db.Boolean)
    message = db.Column(db.String(300))

    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    amount = db.Column(db.Float(asdecimal=True),
                       nullable=False)

    # to_user
    # from_user


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

    receipt_items = relationship("ReceiptItem",
                                 secondary=receiptitem_association_table,
                                 backref="users")

    # TODO try to use SQL?
    @property
    def receipts_of(self):
        receipts_owned_map = {r.id: True for r in self.receipts_owned}
        receipts_in = self.receipts_in

        receipt_notin_owned = [
            r for r in receipts_in if r.id not in receipts_owned_map
        ]

        return receipt_notin_owned

    def add_friend(self, friend):
        if friend not in self.friends:
            self.friends.append(friend)
            friend.friends.append(self)

    def delete_friend(self, friend):
        if friend in self.friends:
            self.friends.remove(friend)
            friend.friends.remove(self)


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
