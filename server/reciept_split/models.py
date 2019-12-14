from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker, relationship, backref
from datetime import date, datetime

from decimal import Decimal

from .meta import db


association_table = db.Table(
    'association',
    db.metadata,
    db.Column('left_id', db.Integer, db.ForeignKey('recieptitem.id')),
    db.Column('right_id', db.Integer, db.ForeignKey('user.id'))
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

    reciept_id = db.Column(db.Integer, db.ForeignKey('reciept.id'))


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
    friend_of_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # friend_of

    friends = relationship("User",
                           backref=backref('friend_of', remote_side=[id])
                           )

    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    fullname = db.Column(db.String(100), nullable=False)

    reciepts = relationship("Reciept", backref="user")

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


class RecieptItem(db.Model):
    __tablename__ = 'recieptitem'
    id = db.Column(db.Integer, primary_key=True)

    reciept_id = db.Column(db.Integer, db.ForeignKey('reciept.id'))

    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float(asdecimal=True),
                       nullable=False)

    # users = relationship("RecieptItem",
    #                      # backref="reciept_items",
    #                      foreign_keys=[User.reciept_item_id])
    # reciept

    users = relationship("User",
                         secondary=association_table,
                         backref="reciept_items")


class Reciept(db.Model):
    __tablename__ = 'reciept'
    # user

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float(asdecimal=True),
                       nullable=False)
    date = db.Column(db.Date,
                     default=date.today(),
                     nullable=False)

    resolved = db.Column(db.Boolean)

    # user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    balances = relationship("Balance", backref="reciept")

    reciept_items = relationship("RecieptItem", backref="reciept",
                                 foreign_keys=[RecieptItem.reciept_id])
