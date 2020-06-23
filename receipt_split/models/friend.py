from receipt_split.meta import db
from . import Base, Settlement, RequestMixin


class Friend(RequestMixin, Base):
    __tablename__ = 'friend'

    id = db.Column(db.Integer, primary_key=True)

    # to_user_id
    # from_user_id

    def accept(self):
        def callback():
            # add settlement objects for each user in the friendrequest on
            # accept
            if Settlement.query.get({
                "from_user_id": self.from_user_id,
                "to_user_id": self.to_user_id
                    }) is None:
                db.session.add(
                    Settlement(
                        from_user_id=self.from_user_id,
                        to_user_id=self.to_user_id,
                        paid_amount=0.0,
                        owed_amount=0.0,
                    )
                )

            if Settlement.query.get({
                "from_user_id": self.to_user_id,
                "to_user_id": self.from_user_id
                    }) is None:
                db.session.add(
                    Settlement(
                        from_user_id=self.to_user_id,
                        to_user_id=self.from_user_id,
                        paid_amount=0.0,
                        owed_amount=0.0,
                    )
                )

        return super().accept(callback=callback)
