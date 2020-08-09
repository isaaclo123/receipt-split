from receipt_split.meta import db
from . import Base, Balance

from decimal import Decimal
from flask import current_app as app
from sqlalchemy.orm import column_property
from sqlalchemy.sql import func
from sqlalchemy import literal_column


def get(self_, user_id, field, default=None):
    data = getattr(self_, field, None)
    if not data:
        return default

    if user_id == self_.left_user_id:
        return data
    elif user_id == self_.right_user_id:
        return -1 * data
    return default


def add(self_, user_id, field, amount):
    data = getattr(self_, field, None)
    if not data:
        return False

    if user_id == self_.left_user_id:
        setattr(self_, field, data + amount)
        return True
    elif user_id == self_.right_user_id:
        setattr(self_, field, data - amount)
        return True
    return False


class Settlement(Base):
    __tablename__ = 'settlement'
    __table_args__ = (
        db.CheckConstraint('left_user_id <> right_user_id'),
    )

    left_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                             primary_key=True, nullable=False)
    right_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                              primary_key=True, nullable=False)

    # user
    # to_user

    owed_amount = db.Column(db.Float(asdecimal=True), nullable=False,
                            default=0.0)

    paid_amount = db.Column(db.Float(asdecimal=True), nullable=False,
                            default=0.0)

    diff_amount = column_property(owed_amount - paid_amount)

# TODO
# https://stackoverflow.com/questions/34057756/how-to-combine-sqlalchemys-hybrid-property-decorator-with-werkzeugs-cached-pr
    def update_settlement(self):
        # get balance from adding up unpaid balances
        from_balances = db.session.query(
            func.coalesce(
                func.sum(Balance.amount), literal_column("0.0")
            ).label("sum")
        ).filter_by(
            from_user_id=self.left_user_id,
            to_user_id=self.right_user_id,
            paid=False
        ).subquery()

        to_balances = db.session.query(
            func.coalesce(
                func.sum(Balance.amount), literal_column("0.0")
            ).label("sum")
        ).filter_by(
            from_user_id=self.right_user_id,
            to_user_id=self.left_user_id,
            paid=False
        ).subquery()

        result = db.session.query(
            from_balances.c.sum - to_balances.c.sum
        ).as_scalar()

        app.logger.info("NEW BALANCE AMOUNT %s", result)

        self.owed_amount = result

        # self.owed_amount = s
        # self.balance_amount = s

    def get(from_user_id, to_user_id):
        app.logger.debug("GET SETTLEMENT %s %s", from_user_id, to_user_id)
        s1 = Settlement.query.get({
            "left_user_id": from_user_id,
            "right_user_id": to_user_id,
        })
        if s1 is None:
            s2 = Settlement.query.get({
                "left_user_id": to_user_id,
                "right_user_id": from_user_id,
            })
            if s2 is None:
                return None
            else:
                return s2
        else:
            return s1

    def get_other_user_id(self, user_id):
        if user_id == self.left_user_id:
            return self.right_user_id
        elif user_id == self.right_user_id:
            return self.left_user_id
        return None

    def get_paid_amount(self, user_id):
        return get(self, user_id, "paid_amount", Decimal(0.0))

    def get_owed_amount(self, user_id):
        return get(self, user_id, "owed_amount", Decimal(0.0))

    def get_diff_total(self, user_id):
        return get(self, user_id, "diff_total", Decimal(0.0))

    def add_payment(self, payment):
        return add(self, payment.from_user_id, "paid_amount", payment.amount)

    def remove_payment(self, payment):
        return add(self, payment.from_user_id, "paid_amount",
                   -1 * payment.amount)

    # def add_balance(self, balance):
    #     if balance.from_user_id == self.left_user_id:
    #         self.paid_amount += balance.amount
    #     elif balance.from_user_id == self.right_user_id:
    #         self.paid_amount -= balance.amount
    #     else:
    #         return False
    #     return True

    # def remove_balance(self, balance):
    #     if balance.from_user_id == self.left_user_id:
    #         self.paid_amount -= balance.amount
    #     elif balance.from_user_id == self.right_user_id:
    #         self.paid_amount += balance.amount
    #     else:
    #         return False
    #     return True

    def apply_balance(self, balance):
        # return True if paid
        if balance.paid:
            return False

        paid_amount = self.get_paid_amount(balance.from_user_id)
        # owed_amount = self.get_owed_amount(balance.from_user_id)

        # if paid_amount < balance.amount or owed_amount < balance.amount:
        if paid_amount < balance.amount:
            app.logger.debug("balance id %s", balance.id)
            app.logger.debug("bal_err paid %s, owed %s cur_bal %s",
                             self.paid_amount, self.owed_amount,
                             balance.amount)
            return False

        add(self, balance.from_user_id, "paid_amount", -1 * balance.amount)
        add(self, balance.from_user_id, "owed_amount", balance.amount)

        # if balance.from_user_id == self.left_user_id:
        #     self.paid_amount -= balance.amount
        #     self.owed_amount += balance.amount
        # elif balance.from_user_id == self.right_user_id:
        #     self.paid_amount += balance.amount
        #     self.owed_amount -= balance.amount

        # self.paid_amount = self.paid_amount - balance.amount
        # self.owed_amount = self.owed_amount - balance.amount

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

        if not add(self, balance.from_user_id, "paid_amount", balance.amount):
            return False

        # self.update_settlement()
        # self.owed_amount = self.owed_amount + balance.amount
        app.logger.debug("\t bal_ADDED! paid %s, owed %s cur_bal %s",
                         self.paid_amount, self.owed_amount,
                         balance.amount)
        return True
