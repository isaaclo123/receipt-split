import os
import datetime

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    FLASK_ENV = "production"

    TESTING = False
    SECRET_KEY = os.environ.get('SECRET_KEY', '99DEBUG_KEY_CHANGE_IN_PROD99')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir,
                                                          'app.db.sqlite3')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    WTF_CSRF_CHECK_DEFAULT = False
    WTF_CSRF_ENABLED = False
    CORS_HEADERS = "Content-Type"

    JWT_EXPIRATION_DELTA = datetime.timedelta(weeks=999)

    DEFAULT_PARSERS = [
        'receipt_split.parsers.SimpleJsonParser',
        # 'flask.ext.api.parsers.JSONParser',
        'flask_api.parsers.URLEncodedParser',
        'flask_api.parsers.MultiPartParser'
    ]

    @property
    def IS_DEVELOPMENT(self):
        return self.FLASK_ENV == "development"


class ProductionConfig(Config):
    FLASK_ENV = "production"

    SQLALCHEMY_DATABASE_URI = os.environ.get('DB_URI')


class DevelopmentConfig(Config):
    FLASK_ENV = "development"

    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir,
                                                          'app.db.sqlite3')
    SQLALCHEMY_ECHO = True
