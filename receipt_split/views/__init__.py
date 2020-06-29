from flask import Blueprint

views = Blueprint('views', __name__)

from receipt_split.helpers import *
from .helpers_view import *
from .balance_view import *
from .friend_view import *
from .payment_view import *
from .receipt_view import *
from .user_view import *
