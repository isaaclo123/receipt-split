from config import Config

from flask_api import FlaskAPI, status
from flask import send_from_directory

import coloredlogs
import traceback
import os
import logging
import wtforms_json

from flask_jwt import JWT
from flask_cors import CORS

from .auth import auth as auth_blueprint, authenticate, identity
from .views import views as views_blueprint
from .meta import db, ma, migrate
from .helpers import err


def create_app():
    app = FlaskAPI(__name__, static_folder="../build")
    app.config.from_object(Config)

    logging.basicConfig(level=logging.DEBUG)
    coloredlogs.install()

    # # To enable logging for flask-cors,
    # logging.getLogger('flask_cors').level = logging.DEBUG

    JWT(app, authenticate, identity)
    CORS(app, automatic_options=True, supports_credentials=True)

    db.init_app(app)
    ma.init_app(app)

    is_sqlite = Config.SQLALCHEMY_DATABASE_URI.startswith('sqlite:')
    app.logger.info("Database URL - %s", Config.SQLALCHEMY_DATABASE_URI)
    migrate.init_app(app, db, render_as_batch=is_sqlite)

    wtforms_json.init()

    def dir_last_updated(folder):
        return str(max(os.path.getmtime(os.path.join(root_path, f))
                   for root_path, dirs, files in os.walk(folder)
                   for f in files))

    # Handle errors and turn them into json
    @app.errorhandler(Exception)
    def handle_error(e):
        trace = traceback.format_exc()

        app.logger.error("EXCEPTION!!!!!!!!!!")
        app.logger.error("%s", trace)
        app.logger.error("EXCEPTION!!!!!!!!!!")
        return err(str(e)), status.HTTP_500_INTERNAL_SERVER_ERROR

    # Serve React App
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(views_blueprint)

    return app
