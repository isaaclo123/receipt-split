from receipt_split.meta import db
from . import Base, OwnedMixin

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func, select
from sqlalchemy.orm import column_property

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

    # resolved = db.Column(db.Boolean)

    # user
    # users

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    balances = relationship("Balance", backref="receipt",
                            cascade="all,delete-orphan")

    receipt_items = relationship("ReceiptItem", backref="receipt",
                                 foreign_keys=[ReceiptItem.receipt_id],
                                 cascade="all,delete-orphan")

    @property
    def resolved(self):
        balances = db.session.query(
            Balance.paid
        ).filter_by(receipt_id=self.id)

        # if no balances, is 0
        if balances.count() <= 0:
            return False

        unpaid_count = balances.filter(
            balances.c.paid.is_(False)
        ).count()

        if unpaid_count > 0:
            return False

        return True


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
