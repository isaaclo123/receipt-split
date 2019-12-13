from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker, relationship, backref
from datetime import date, datetime

from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey, Boolean,\
    String, Float

from decimal import Decimal

from .meta import db


class Balance(db.Model):
    __tablename__ = 'balance'
    id = db.Column(db.Integer, primary_key=True)

    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    amount = db.Column(db.Float(asdecimal=True),
                       nullable=False,
                       python_type=Decimal)

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
                       nullable=False,
                       python_type=Decimal)


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    friend_of_id = db.Column(db.Integer, db.ForeignKey('user.id'))

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


class Reciept(db.Model):
    __tablename__ = 'reciept'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float(asdecimal=True),
                       nullable=False,
                       python_type=Decimal)
    date = db.Column(db.Date,
                     default=date.today(),
                     nullable=False)

    resolved = db.Column(db.Boolean)

    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    balances = relationship("Balance", backref="reciept")

    reciept_items = relationship("RecieptItem", backref="reciept")


class RecieptItem(db.Model):
    __tablename__ = 'recieptitem'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float(asdecimal=True),
                       nullable=False,
                       python_type=Decimal)

    reciept_id = db.Column(db.Integer, db.ForeignKey('reciept.id'))
