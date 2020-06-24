from receipt_split.models import Balance
from . import ModelForm


class BalanceForm(ModelForm):
    class Meta:
        model = Balance
