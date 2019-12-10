import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = True
    TESTING = False
    # DATABASE_URI = 'sqlite:///:memory:'
    # SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
    #     'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

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
