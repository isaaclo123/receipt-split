import os
from receipt_split import create_app

config = "config.ProductionConfig"

if (os.environ.get('FLASK_ENV') == "development"):
    config = "config.DevelopmentConfig"

app = create_app(config)
