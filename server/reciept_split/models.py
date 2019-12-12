from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker, relationship, backref
from datetime import datetime

from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey, Boolean,\
    String, Float

from .meta import db


class Balance(db.Model):
    __tablename__ = 'balance'
    id = db.Column(db.Integer, primary_key=True)

    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    value = db.Column(db.Float(asdecimal=True))

    reciept_id = db.Column(db.Integer, db.ForeignKey('reciept.id'))


class Payment(db.Model):
    __tablename__ = 'payment'
    id = db.Column(db.Integer, primary_key=True)

    created = db.Column(db.DateTime(), default=datetime.utcnow())

    # true is accepted, false is not accepted, null is not accepted or rejected
    accepted = db.Column(db.Boolean, nullable=True)
    message = db.Column(db.String(256), nullable=True)

    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    value = db.Column(db.Float(asdecimal=True))


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    friend_of_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    friends = relationship("User",
                           backref=backref('friend_of', remote_side=[id])
                           )

    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    fullname = db.Column(db.String(100))

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

    # friends = relationship("User")


class Reciept(db.Model):
    __tablename__ = 'reciept'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    price = db.Column(db.Float(asdecimal=True))
    date = db.Column(db.Date)

    resolved = db.Column(db.Boolean)

    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    balances = relationship("Balance", backref="reciept")

    reciept_items = relationship("RecieptItem", backref="reciept")


class RecieptItem(db.Model):
    __tablename__ = 'recieptitem'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    value = db.Column(db.Float(asdecimal=True))

    reciept_id = db.Column(db.Integer, db.ForeignKey('reciept.id'))
