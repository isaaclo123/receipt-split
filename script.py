from receipt_split.models import User
from receipt_split.meta import db

x = User.query.all()

for i in x:
    for j in x:
        i.add_friend(j)

db.session.commit()
