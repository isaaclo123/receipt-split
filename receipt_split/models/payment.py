from receipt_split.meta import db
from . import Settlement, RequestMixin, Base

from sqlalchemy.sql import func

MAX_MESSAGE_LENGTH = 300


class Payment(RequestMixin, Base):
    __tablename__ = 'payment'

    id = db.Column(db.Integer, primary_key=True)

    # TODO
    date = db.Column(db.DateTime(), default=func.now(), nullable=False)

    # accepted
    # archived

    message = db.Column(db.String(MAX_MESSAGE_LENGTH))

    # to_user_id
    # from_user_id
    # to_user
    # from_user

    amount = db.Column(db.Float(asdecimal=True), nullable=False)

    # methods return True if modified, else False
    def accept(self):
        def callback():
            s = Settlement.query.get({
                "from_user_id": self.from_user_id,
                "to_user_id": self.to_user_id
            })
            s.add_payment(self)

        return super().accept(callback=callback)

    def reject(self):
        def callback():
            s = Settlement.query.get({
                "from_user_id": self.from_user_id,
                "to_user_id": self.to_user_id
            })
            s.remove_payment(self)

        return super().reject(callback=callback)
