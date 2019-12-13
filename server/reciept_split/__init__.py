from flask_api import FlaskAPI, status
from flask import request
from config import Config
from flask_migrate import Migrate

import logging

# from .models import db
from .auth import auth as auth_blueprint, authenticate, identity
from .views import views as views_blueprint

from flask_jwt import JWT
from flask_cors import CORS, cross_origin
# db.init_app(app)
# migrate = Migrate(app, db)
from .models import *

from .meta import db


def create_app():
    app = FlaskAPI(__name__)
    app.config.from_object(Config)

    logging.basicConfig(level=logging.INFO)

    # To enable logging for flask-cors,
    logging.getLogger('flask_cors').level = logging.DEBUG

    CORS(app, automatic_options=True, supports_credentials=True)
    JWT(app, authenticate, identity)

    db.init_app(app)

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(views_blueprint)

    @app.before_first_request
    def before_first_request_func():
        # db.drop_all()
        db.create_all()
        db.session.commit()

    return app

# return app
