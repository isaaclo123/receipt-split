# from flask import current_app as app
# from sqlalchemy.orm import column_property
from sqlalchemy.sql import select

from receipt_split.meta import db
from . import Base, OwnedMixin


def balance_paid_default(context):
    params = context.get_current_parameters()
    # if to_user and from_user same, should be paid True, else False
    return params["to_user_id"] == params["from_user_id"]


class Balance(OwnedMixin, Base):
    __tablename__ = 'balance'

    id = db.Column(db.Integer, primary_key=True)

    # to_user
    # from_user

    amount = db.Column(db.Float(asdecimal=True),
                       nullable=False)
    paid = db.Column(db.Boolean, nullable=False, default=balance_paid_default)

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
        from .receipt_model import Receipt

        receipt_name = select(
                [Receipt.name]
            ).select_from(
                Receipt
            ).where(
                Receipt.id == self.receipt_id
            ).correlate_except(Receipt)

        return db.session.scalar(receipt_name)

    @property
    def is_to_and_from_owner(self):
        return self.to_user_id == self.from_user_id

    # def delete(self):
    #     if self.paid and not self.is_to_and_from_owner:
    #         s = Settlement.query.get({
    #             "from_user_id": self.from_user_id,  # from pays to
    #             "to_user_id": self.to_user_id
    #         })
    #         s.add_amount(self.amount)
