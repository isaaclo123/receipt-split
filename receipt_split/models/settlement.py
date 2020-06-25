from receipt_split.meta import db
from . import Base, Balance

from flask import current_app as app
from sqlalchemy.orm import column_property
from sqlalchemy.sql import func
from sqlalchemy import literal_column


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

    diff_amount = column_property(owed_amount - paid_amount)

# TODO
# https://stackoverflow.com/questions/34057756/how-to-combine-sqlalchemys-hybrid-property-decorator-with-werkzeugs-cached-pr
    def update_settlement(self):
        # get balance from adding up unpaid balances
        s = db.session.query(
            func.coalesce(func.sum(Balance.amount), literal_column("0.0"))
        ).filter_by(
            from_user_id=self.from_user_id,
            to_user_id=self.to_user_id,
            paid=False
        ).as_scalar()

        app.logger.debug("------")
        app.logger.debug("settlement balance %s", s)
        app.logger.debug("settlement %s", self)
        app.logger.debug("------")

        self.owed_amount = s

    def add_amount(self, amount):
        self.paid_amount = self.paid_amount + amount

    def remove_amount(self, amount):
        self.paid_amount = self.paid_amount - amount

    def apply_balance(self, balance):
        # return True if paid
        if balance.paid:
            return False
        if self.paid_amount < balance.amount\
                or self.owed_amount < balance.amount:
            app.logger.debug("balance id %s", balance.id)
            app.logger.debug("bal_err paid %s, owed %s cur_bal %s",
                             self.paid_amount, self.owed_amount,
                             balance.amount)
            return False

        self.paid_amount = self.paid_amount - balance.amount
        self.owed_amount = self.owed_amount - balance.amount
        balance.paid = True

        app.logger.debug("bal_OK! paid %s, owed %s cur_bal %s",
                         self.paid_amount, self.owed_amount,
                         balance.amount)
        return True

    def add_balance_back(self, balance):
        app.logger.debug("Balance AddedBack bal %s settlement %s, %s->%s",
                         balance.id, self.from_user_id, self.to_user_id)
        if not balance.paid:
            app.logger.debug("\tDid not add back, as balance unpaid")
            return False

        self.paid_amount = self.paid_amount + balance.amount
        self.update_settlement()
        # self.owed_amount = self.owed_amount + balance.amount
        app.logger.debug("\t bal_ADDED! paid %s, owed %s cur_bal %s",
                         self.paid_amount, self.owed_amount,
                         balance.amount)
        return True
