#!/usr/bin/env bash

trap exit INT

# pipenv run flask db stamp head
pipenv run flask db migrate
pipenv run flask db upgrade
pipenv run gunicorn -w $WSGI_WORKERS -b :5000 "receipt_split:create_app()"
