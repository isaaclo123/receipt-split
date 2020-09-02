from .helpers_schema import *
from .user_schema import *
from .balance_schema import *
from .receipt_schema import *
from .payment_schema import *
from .friend_schema import *
from .balancesum_schema import *

user_schema = UserSchema()
users_schema = UserSchema(many=True)

balances_schema = BalanceSchema(many=True)
balance_sum_schema = BalanceSumSchema(many=True)

receipt_schema = ReceiptSchema()
receipts_schema = ReceiptSchema(many=True, exclude=RECEIPT_INFO_EXCLUDE_FIELDS)
receipt_create_schema = ReceiptCreateSchema()

payment_schema = PaymentSchema()
payment_create_schema = PaymentCreateSchema()
payments_schema = PaymentSchema(many=True)

friend_schema = FriendSchema()
friends_schema = FriendSchema(many=True)
