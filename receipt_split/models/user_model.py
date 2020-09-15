from receipt_split.meta import db
from . import receiptitem_association_table, receipt_association_table, Base,\
    Settlement, Friend, Payment, Receipt, Balance

from sqlalchemy.sql import or_, and_
# from flask import current_app as app
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = 'user'
    # friend_of
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    fullname = db.Column(db.String(100), nullable=False)

    receipts_owned = relationship("Receipt", backref="user",
                                  cascade="merge,delete")

    receipts_in = relationship("Receipt",
                               secondary=receipt_association_table,
                               backref="users")

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

    settlements_right_user = relationship("Settlement",
                                          foreign_keys=[
                                              Settlement.right_user_id
                                          ],
                                          backref="to_user")

    settlements_left_user = relationship("Settlement",
                                         foreign_keys=[
                                             Settlement.left_user_id
                                         ],
                                         backref="user")

    receipt_items = relationship("ReceiptItem",
                                 secondary=receiptitem_association_table,
                                 backref="users")

    friend_to_user = relationship("Friend",
                                  foreign_keys=[
                                      Friend.to_user_id
                                  ], backref="to_user")

    friend_from_user = relationship("Friend",
                                    foreign_keys=[
                                        Friend.from_user_id
                                    ], backref="from_user")

    @property
    def settlements(self):
        settle_from = db.session.query(
            Settlement.left_user_id.label("left_user_id"),
            Settlement.right_user_id.label("right_user_id")
        ).filter_by(
            left_user_id=self.id
        )

        settle_to = db.session.query(
            Settlement.left_user_id.label("left_user_id"),
            Settlement.right_user_id.label("right_user_id")
        ).filter_by(
            right_user_id=self.id
        )

        result_ids = settle_from.union(settle_to).subquery()

        result = db.session.query(
            Settlement
        ).select_from(
            result_ids
        ).join(
            Settlement,
            and_(
                Settlement.left_user_id == result_ids.c.left_user_id,
                Settlement.right_user_id == result_ids.c.right_user_id
            )
        )

        return result

    @property
    def friends(self):
        friends_from = db.session.query(
            Friend.to_user_id.label("id")
        ).select_from(Friend).filter_by(
            from_user_id=self.id,
            accepted=True
        )

        friends_to = db.session.query(
            Friend.from_user_id.label("id")
        ).select_from(Friend).filter_by(
            to_user_id=self.id,
            accepted=True
        )

        all_friends_ids = friends_from.union(friends_to).subquery()

        all_friends = db.session.query(
            User
        ).select_from(
            all_friends_ids
        ).join(
            User,
            User.id == all_friends_ids.c.id
        )

        return all_friends

    @property
    def receipts_owned_unresolved(self):
        result = Receipt.query.filter(
            Receipt.user_id == self.id,
            Receipt.resolved.is_(False)
        )
        return result

    @property
    def receipts_owned_resolved(self):
        result = Receipt.query.filter(
            Receipt.user_id == self.id,
            Receipt.resolved.is_(True)
        )
        return result

    @property
    def receipts_owed_unresolved(self):
        result = Receipt.query.join(
            receipt_association_table,
        ).filter(
            receipt_association_table.c.left_id == self.id,
            Receipt.user_id != self.id,
            Receipt.resolved.is_(False)
        )

        # app.logger.debug("receipts_owed expression running - %s", result)

        return result

    @property
    def receipts_owed_resolved(self):
        result = Receipt.query.join(
            receipt_association_table,
        ).filter(
            receipt_association_table.c.left_id == self.id,
            Receipt.user_id != self.id,
            Receipt.resolved.is_(True)
        )

        # app.logger.debug("receipts_owed expression running - %s", result)

        return result

    @property
    def receipts_owed(self):
        result = Receipt.query.join(
            receipt_association_table,
        ).filter(
            receipt_association_table.c.left_id == self.id,
            Receipt.user_id != self.id
        )

        # app.logger.debug("receipts_owed expression running - %s", result)

        return result

    @property
    def receipts_resolved(self):
        # TODO
        result = Receipt.query.join(
            receipt_association_table,
        ).filter(
            or_(
                receipt_association_table.c.left_id == self.id,
                receipt_association_table.c.right_id == self.id,
            ),
            # Receipt.user_id != self.id,
            Receipt.resolved.is_(True)
        )

        return result
