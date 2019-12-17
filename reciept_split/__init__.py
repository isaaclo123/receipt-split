from flask_api import FlaskAPI
from config import Config
# from flask_migrate import Migrate

import logging
import wtforms_json

from flask import request

# from .models import db
from .auth import auth as auth_blueprint, authenticate, identity
from .views import views as views_blueprint

from flask_jwt import JWT
from flask_cors import CORS
# db.init_app(app)
# migrate = Migrate(app, db)
from .models import *

from .meta import db, ma


def create_app():
    app = FlaskAPI(__name__)
    app.config.from_object(Config)

    logging.basicConfig(level=logging.INFO)

    # # To enable logging for flask-cors,
    # logging.getLogger('flask_cors').level = logging.DEBUG

    JWT(app, authenticate, identity)
    CORS(app, automatic_options=True, supports_credentials=True)

    db.init_app(app)
    ma.init_app(app)
    wtforms_json.init()

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(views_blueprint)

    @app.route('/')
    def root():
        return app.send_static_file('index.html')

    @app.before_first_request
    def before_first_request_func():
        # db.metadata.clear()
        # db.drop_all()
        db.create_all()
        db.session.commit()
        # user = User(username="test", password="test", fullname="test test")
        # db.session.add(user)
        # db.session.commit()

    return app

# return app
