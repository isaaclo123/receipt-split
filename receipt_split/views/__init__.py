from flask import Blueprint

views = Blueprint('views', __name__)

from receipt_split.helpers import *
from .helpers import *
from .balances import *
from .friend import *
from .payment import *
from .receipt import *
from .user import *
