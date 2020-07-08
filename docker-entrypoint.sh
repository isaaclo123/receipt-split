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
        --) shift ; break ;;
        *) echo "Internal error!" ; exit 1 ;;
    esac
done

# Now take action
echo "DB_URI: $DB_URI SECRET_KEY $SECRET_KEY"

pipenv run flask db stamp head
pipenv run flask db migrate
pipenv run flask db upgrade
pipenv run gunicorn -w $WSGI_WORKERS -b :5000 'receipt_split:create_app()'
