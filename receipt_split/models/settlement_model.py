from receipt_split.meta import db
from . import Base, Balance

from decimal import Decimal
from flask import current_app as app
from sqlalchemy.orm import column_property
from sqlalchemy.sql import func
from sqlalchemy import literal_column


def is_valid_user(self_, user_id):
    return (user_id == self_.left_user_id or user_id == self_.right_user_id)


def get(self_, user_id, field, default=None):
    data = getattr(self_, field, None)
    if data is None:
        return default

    if user_id == self_.left_user_id:
        return data
    elif user_id == self_.right_user_id:
        return -1 * data
    return default


def add(self_, user_id, field, amount):
    data = getattr(self_, field, None)
    if data is None:
        # app.logger.debug("   NOT EXIST data %s", data)
        return False

    # app.logger.debug("ADD DATA %s", data)
    # app.logger.debug("ADD DATA amount %s", amount)

    if user_id == self_.left_user_id:
        result = data + amount

        setattr(self_, field, result)
        # app.logger.debug("ADD DATA result %s", result)
        return True
    elif user_id == self_.right_user_id:
        result = data - amount

        setattr(self_, field, result)
        # app.logger.debug("ADD DATA result %s", result)
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

    def get_balances_to_pay(self, user_id):
        if not is_valid_user(self, user_id):
            # if from or to balance user is invalid, then return false
            return []

        other_user_id = self.get_other_user_id(user_id)

        app.logger.debug("Balances get_balances_to_pay other_user_id %s",
                         other_user_id)

        balances = Balance.query.filter_by(
            from_user_id=user_id,
            to_user_id=other_user_id,
            paid=False
        ).all()

        app.logger.debug("Balances get_balances_to_pay %s", balances)

        return balances

    def get_balances_owed(self, user_id):
        if not is_valid_user(self, user_id):
            # if from or to balance user is invalid, then return false
            return []

        other_user_id = self.get_other_user_id(user_id)

        balances = Balance.query.filter_by(
            from_user_id=other_user_id,
            to_user_id=user_id,
            paid=False
        ).all()

        return balances

# TODO
# https://stackoverflow.com/questions/34057756/how-to-combine-sqlalchemys-hybrid-property-decorator-with-werkzeugs-cached-pr
    # def update_settlement(self):
    #     """should be legacy"""
    #     # get balance from adding up unpaid balances
    #     from_balances = db.session.query(
    #         func.coalesce(
    #             func.sum(Balance.amount), literal_column("0.0")
    #         ).label("sum")
    #     ).filter_by(
    #         from_user_id=self.left_user_id,
    #         to_user_id=self.right_user_id,
    #         paid=False
    #     ).subquery()

    #     to_balances = db.session.query(
    #         func.coalesce(
    #             func.sum(Balance.amount), literal_column("0.0")
    #         ).label("sum")
    #     ).filter_by(
    #         from_user_id=self.right_user_id,
    #         to_user_id=self.left_user_id,
    #         paid=False
    #     ).subquery()

    #     result = db.session.query(
    #         (from_balances.c.sum - to_balances.c.sum).label("result")
    #     ).scalar()

    #     app.logger.info("NEW BALANCE AMOUNT %s", result)

    #     self.owed_amount = result

    #     app.logger.info("NEW BALANCE owed AMOUNT %s", self.owed_amount)

    #     # self.owed_amount = s
    #     # self.balance_amount = s

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

    def get_diff_amount(self, user_id):
        return get(self, user_id, "diff_amount", Decimal(0.0))

    def add_payment(self, payment):
        """
        add payment and apply balances if possible.
        return true if payment added
        """
        if add(self, payment.from_user_id, "paid_amount", payment.amount):
            self.pay_balances()
            return True
        return False

    def remove_payment(self, payment):
        """
        remove payment and apply balances if possible.
        return true if payment removed successfully
        """
        if add(
            self, payment.from_user_id, "paid_amount", -1 * payment.amount
        ):
            self.pay_balances()
            return True
        return False

    def apply_balance(self, balance):
        """
        applies balance to settlement
        return False if did not add balance to settlement, else return True
        """

        if balance.paid:
            # dont apply if paid
            app.logger.debug("APPLY BALANCE balance already paid")
            return False

        if not is_valid_user(self, balance.from_user_id) or \
                not is_valid_user(self, balance.to_user_id):
            # if from or to balance user is invalid, then return false
            return False

        if balance.to_user_id == balance.from_user_id:
            return False

        # balance: from_user pays to_user
        paid_amount = self.get_paid_amount(balance.from_user_id)

        app.logger.debug("APPLY BALANCE paid %s bal %s", paid_amount,
                         balance.amount)

        if paid_amount < balance.amount:
            # if cannot pay right away for balance
            # add to balance owed_amount
            add(self, balance.from_user_id, "owed_amount", balance.amount)
            return True

        # otherwise, subtract from paid_amount for the balance and set balance
        # to paid. Do not change owed_amount

        add(self, balance.from_user_id, "paid_amount", -1 * balance.amount)
        balance.paid = True

        app.logger.debug("bal_OK! paid %s, owed %s cur_bal %s",
                         self.paid_amount, self.owed_amount,
                         balance.amount)
        return True

    def add_balance_back(self, balance):
        """
        reverts added balance from settlement
        return False if did not revert to settlement, else delete and return
        True
        """

        app.logger.debug("ADD_BALANCE_BACK")

        app.logger.debug("\tbal_id=%s settlement %s->%s",
                         balance.id, balance.from_user_id, balance.to_user_id)

        if not is_valid_user(self, balance.from_user_id) or \
                not is_valid_user(self, balance.to_user_id):
            # if from or to balance user is invalid, then return false
            return False

        if balance.to_user_id == balance.from_user_id:
            app.logger.debug("\tDid not add back, as balance is to self")

            db.session.delete(balance)
            return True

        if balance.paid:
            app.logger.debug("\tbalance paid, so add back to paid_amount")
            add(self, balance.from_user_id, "paid_amount", balance.amount)
        else:
            # if paid balance, remove from balance in settlement.
            add(self, balance.from_user_id, "owed_amount", -1 * balance.amount)

        db.session.delete(balance)
        return True

    def pay_balances(self):
        app.logger.debug("PAY_BALANCES")

        balances = []

        check_user_id = None

        app.logger.debug("\t(before) paid_amount=%s balance_amount=%s",
                         self.paid_amount, self.owed_amount)

        if self.paid_amount > 0:
            # left user has payment to adjust balances
            check_user_id = self.left_user_id
            app.logger.debug("\tcheck_user left %s", check_user_id)
        elif self.paid_amount < 0:
            check_user_id = self.right_user_id
            app.logger.debug("\tcheck_user right %s", check_user_id)

        if check_user_id is not None:
            balances = Balance.query.filter(
                Balance.from_user_id == check_user_id,
                # balances user must pay
                Balance.to_user_id != check_user_id,
                # no self addressed
                Balance.paid.is_(False)  # only get unpaid balances
            ).order_by(Balance.created_on).all()
        else:
            app.logger.debug("\tERROR check_user_id is None")
            return

        for balance in balances:
            # balances are all "check_user_id pays to"

            app.logger.debug("\tbalance from %s->%s", balance.from_user_id,
                             balance.to_user_id)

            app.logger.debug("\t\tpaid_amount=%s balance_amount=%s",
                             self.get_paid_amount(check_user_id),
                             balance.amount)

            if self.get_paid_amount(check_user_id) >= balance.amount:
                add(self, check_user_id, "paid_amount", -1 * balance.amount)
                add(self, check_user_id, "owed_amount", -1 * balance.amount)
                balance.paid = True

        app.logger.debug("\t(final) paid_amount=%s balance_amount=%s",
                         self.paid_amount, self.owed_amount)
