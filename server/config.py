import os
import datetime
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = True
    TESTING = False
    SECRET_KEY = os.environ.get('SECRET_KEY', '99DEBUG_KEY_CHANGE_IN_PROD99')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir,
                                                          'app.db.sqlite3')

    WTF_CSRF_CHECK_DEFAULT = False
    WTF_CSRF_ENABLED = False
    CORS_HEADERS = 'Content-Type'

    JWT_EXPIRATION_DELTA = datetime.timedelta(weeks=999)

    DEFAULT_PARSERS = [
        'reciept_split.parsers.SimpleJsonParser',
        # 'flask.ext.api.parsers.JSONParser',
        'flask_api.parsers.URLEncodedParser',
        'flask_api.parsers.MultiPartParser'
    ]

    # @property
    # def DATABASE_URI(self):         # Note: all caps
    #     return 'mysql://user@{}/foo'.format(self.DB_SERVER)


# class ProductionConfig(Config):
#     DATABASE_URI = 'mysql://user@localhost/foo'
#
#
# class DevelopmentConfig(Config):
#     DEBUG = True
#
#
# class TestingConfig(Config):
#     TESTING = True
