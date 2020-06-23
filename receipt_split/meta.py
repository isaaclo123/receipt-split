from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate

# https://github.com/miguelgrinberg/Flask-Migrate/issues/61#issuecomment-208131722
# naming_convention = {
#     "ix": 'ix_%(column_0_label)s',
#     "uq": "uq_%(table_name)s_%(column_0_name)s",
#     "ck": "ck_%(table_name)s_%(column_0_name)s",
#     "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
#     "pk": "pk_%(table_name)s"
# }
# db = SQLAlchemy(metadata=MetaData(naming_convention=naming_convention))

db = SQLAlchemy()

ma = Marshmallow()

migrate = Migrate()
