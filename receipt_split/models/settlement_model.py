from receipt_split.meta import db
from . import Base, Balance

from flask import current_app as app
from sqlalchemy.orm import column_property
from sqlalchemy.sql import func
from sqlalchemy import literal_column, and_, or_, case
from sqlalchemy.ext.hybrid import hybrid_method


class Settlement(Base):
    __tablename__ = 'settlement'
    __table_args__ = (
        db.CheckConstraint('from_user_id <> to_user_id'),
    )

    left_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                             primary_key=True, nullable=False)
    right_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                              primary_key=True, nullable=False)

    # user
    # to_user

    balance_amount = db.Column(db.Float(asdecimal=True), nullable=False,
                               default=0.0)

    paid_amount = db.Column(db.Float(asdecimal=True), nullable=False,
                            default=0.0)

    def get_settlement(user1_id, user2_id):
        # from then to
        if user1_id == user2_id:
            # settlement to self should not exist
            return None

        settlement1 = Settlement.query.get({
                         "left_user_id": user1_id,
                         "right_user_id": user2_id,
                      })
        settlement2 = Settlement.query.get({
                         "left_user_id": user2_id,
                         "right_user_id": user1_id,
                      })

        if settlement1 is not None:
            settlement1
            return settlement1

        if settlement2 is not None:
            return settlement2

        return None

    def balances_from(self, user_id):
        if self.left_user_id == user_id:
            return Settlement.query.filter_by(
                from_user_id=user_id,
                to_user_id=self.right_user_id
            ).all()
        elif self.right_user_id == user_id:
            return Settlement.query.filter_by(
                from_user_id=user_id,
                to_user_id=self.left_user_id
            ).all()
        return []

    def pay(self, user_id, amount):
        if self.left_user_id == user_id:
            # if you pay left user, you are right user, so subtract
            self.paid_amount -= amount
        elif self.right_user_id == user_id:
            # if you pay right user, you are left user, so add
            self.paid_amount += amount
        return

    @hybrid_method
    def get_balance_amount(self, user_id):
        if self.left_user_id == user_id:
            return self.balance_amount
        elif self.right_user_id == user_id:
            return -1 * self.balance_amount
        return None

    @get_balance_amount.expression
    def get_balance_amount(self, user_id):
        return case([
            (
                user_id == self.left_user_id,
                self.balance_amount
            ),
            (
                user_id == self.right_user_id,
                -1 * self.balance_amount
            )
        ])

    def get_paid_amount(self, user_id):
        if self.left_user_id == user_id:
            return self.paid_amount
        elif self.right_user_id == user_id:
            return -1 * self.paid_amount
        return None

    @get_paid_amount.expression
    def get_paid_amount(self, user_id):
        return case([
            (
                user_id == self.left_user_id,
                self.paid_amount
            ),
            (
                user_id == self.right_user_id,
                -1 * self.paid_amount
            )
        ])

    def get_diff_amount(self, user_id):
        return self.get_balance_amount(user_id) - self.get_paid_amount(user_id)

    # TODO
    def apply_balance(self, balance):
        # removes balance cost from a balance for a user side
        if balance.paid:
            return False

        if balance.from_user == self.left_user_id:
            # left pays right user, subtract cost of from l -> to r balance
            self.balance_amount -= balance.amount
            balance.paid = True
            return True
        elif balance.from_user == self.right_user_id:
            # right pays left user, add cost of from r -> to l balance
            self.balance_amount += balance.amount
            balance.paid = True
            return True

        return False

# TODO
# https://stackoverflow.com/questions/34057756/how-to-combine-sqlalchemys-hybrid-property-decorator-with-werkzeugs-cached-pr
    def update_settlement(self):
        # case_statement = case(
        #     [
        #         (Balance.from_user_id == self.left_user_id,
        #          Balance.amount)  # add
        #         (Balance.from_user_id == self.right_user_id,
        #          -1 * Balance.amount)
        #     ]
        # )

        # # get balance from adding up unpaid balances
        # s = db.session.query(
        #     func.coalesce(
        #         func.sum(
        #             case_statement
        #         ),
        #         literal_column("0.0")
        #     )
        # ).filter_by(
        #     or_(
        #         and_(
        #             from_user_id=self.left_user_id,
        #             to_user_id=self.right_user_id
        #         ),
        #         and_(
        #             from_user_id=self.right_user_id,
        #             to_user_id=self.left_user_id
        #         ),
        #     ),
        #     paid=False
        # ).as_scalar()

        s = db.session.query(
            func.coalesce(func.sum(Balance.amount), literal_column("0.0"))
        ).filter_by(
            from_user_id=self.left_user_id,
            to_user_id=self.right_user_id,
            paid=False
        ).as_scalar()

        s2 = db.session.query(
            func.coalesce(func.sum(Balance.amount), literal_column("0.0"))
        ).filter_by(
            to_user_id=self.left_user_id,
            from_user_id=self.right_user_id,
            paid=False
        ).as_scalar()

        app.logger.debug("------")
        app.logger.debug("settlement balance %s", s - s2)
        app.logger.debug("settlement %s", self)
        app.logger.debug("------")

        self.balance_amount = s - s2

    # def add_amount(self, amount):
    #     self.paid_amount = self.paid_amount + amount

    # def remove_amount(self, amount):
    #     self.paid_amount = self.paid_amount - amount

    # def apply_balance(self, balance):
    #     # return True if paid
    #     if balance.paid:
    #         return False
    #     if self.paid_amount < balance.amount\
    #             or self.owed_amount < balance.amount:
    #         app.logger.debug("balance id %s", balance.id)
    #         app.logger.debug("bal_err paid %s, owed %s cur_bal %s",
    #                          self.paid_amount, self.owed_amount,
    #                          balance.amount)
    #         return False

    #     self.paid_amount = self.paid_amount - balance.amount
    #     self.owed_amount = self.owed_amount - balance.amount
    #     balance.paid = True

    #     app.logger.debug("bal_OK! paid %s, owed %s cur_bal %s",
    #                      self.paid_amount, self.owed_amount,
    #                      balance.amount)
    #     return True

    # def add_balance_back(self, balance):
    #     app.logger.debug("Balance AddedBack bal %s settlement %s, %s->%s",
    #                      balance.id, self.from_user_id, self.to_user_id)
    #     if not balance.paid:
    #         app.logger.debug("\tDid not add back, as balance unpaid")
    #         return False

    #     self.paid_amount = self.paid_amount + balance.amount
    #     self.update_settlement()
    #     # self.owed_amount = self.owed_amount + balance.amount
    #     app.logger.debug("\t bal_ADDED! paid %s, owed %s cur_bal %s",
    #                      self.paid_amount, self.owed_amount,
    #                      balance.amount)
    #     return True
