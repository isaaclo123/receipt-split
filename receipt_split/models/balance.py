# from flask import current_app as app
# from sqlalchemy.orm import column_property
from sqlalchemy.sql import select

from receipt_split.meta import db
from . import Base, OwnedMixin


class Balance(OwnedMixin, Base):
    __tablename__ = 'balance'

    id = db.Column(db.Integer, primary_key=True)

    # to_user
    # from_user

    amount = db.Column(db.Float(asdecimal=True),
                       nullable=False)
    paid = db.Column(db.Boolean, nullable=False, default=False)

    receipt_id = db.Column(db.Integer, db.ForeignKey('receipt.id'))
    # receipt_name = column_property(
    #     select(
    #         [Receipt.name]
    #     ).select_from(
    #         Receipt
    #     ).where(
    #         Receipt.id == receipt_id
    #     ).correlate_except(Receipt)
    # )

    @property
    def receipt_name(self):
        from .receipt import Receipt

        receipt_name = select(
                [Receipt.name]
            ).select_from(
                Receipt
            ).where(
                Receipt.id == self.receipt_id
            ).correlate_except(Receipt)

        return db.session.scalar(receipt_name)
