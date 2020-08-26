#!/usr/bin/env bash

# read the options
TEMP=`getopt -o d:s:w: --long db-uri:,secret-key:,wsgi-workers: -- "$@"`
eval set -- "$TEMP"

# extract options and their arguments into variables.
while true ; do
    case "$1" in
        -d|--db-uri)
            export DB_URI=$2 ; shift 2 ;;
        -s|--secret-key)
            export SECRET_KEY=$2 ; shift 2 ;;
        -w|--wsgi-workers)
            export WSGI_WORKERS=$2 ; shift 2 ;;
        -b|--bind)
            export GUNICORN_SOCK=$2 ; shift 2 ;;
        --) shift ; break ;;
        *) echo "Internal error!" ; exit 1 ;;
    esac
done

# Now take action
echo "DB_URI: $DB_URI"
echo "SECRET_KEY: $SECRET_KEY"
echo "WSGI_WORKERS: $WSGI_WORKERS"

pipenv run flask db stamp head
pipenv run flask db migrate
pipenv run flask db upgrade

if [ -z ${var+x} ]; then
    echo "NO GUNICORN_SOCK";
    pipenv run gunicorn -w $WSGI_WORKERS -b :5000 'receipt_split:app' -k gevent
else
    echo "GUNICORN_SOCK: $GUNICORN_SOCK"
    pipenv run gunicorn -w $WSGI_WORKERS -b :5000 'receipt_split:app' -k gevent --bind $GUNICORN_SOCK
fi
