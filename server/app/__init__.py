from flask_api import FlaskAPI
from flask import request
from config import Config
from flask_migrate import Migrate

# from .models import db
from .auth import auth as auth_blueprint

# db.init_app(app)
# migrate = Migrate(app, db)
from .models import db
from .models import *


def create_app():
    app = FlaskAPI(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    app.register_blueprint(auth_blueprint)

    @app.before_first_request
    def before_first_request_func():
        db.drop_all()
        db.create_all()
        db.session.commit()

    return app

# return app
