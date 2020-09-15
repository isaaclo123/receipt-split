# from flask import current_app as app
from sqlalchemy.orm import relationship, column_property
from sqlalchemy.sql import func, select, exists, and_

from receipt_split.meta import db
from . import Base, Balance

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
                     default=func.now(),
                     nullable=False)

    tax = db.Column(db.Float(asdecimal=True), nullable=False, default=0)

    # resolved = db.Column(db.Boolean)

    # user
    # users

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    balances = relationship("Balance", backref="receipt",
                            cascade="all,delete-orphan")

    receipt_items = relationship("ReceiptItem", backref="receipt",
                                 foreign_keys=[ReceiptItem.receipt_id],
                                 cascade="all,delete-orphan")

    resolved = column_property(
        and_(
            exists(  # check that balance exists, else not resolved
                select(
                    [Balance.id]
                ).select_from(
                    Balance
                ).where(
                    Balance.receipt_id == id,
                ).correlate_except(Balance)
            ),
            ~exists(  # if bal exist, check that no unpaid balances exist
                select(
                    [Balance.id]
                ).select_from(
                    Balance
                ).where(
                    and_(
                        Balance.receipt_id == id,
                        Balance.paid.is_(False)
                    )
                ).correlate_except(Balance)
            )

        )
    )
