FROM python:3.8

RUN pip install pipenv

WORKDIR /srv/receipt-split
COPY ./migrations/ ./migrations/
COPY ./receipt_split/ ./receipt_split/

COPY ./config.py .
COPY ./Pipfile .
COPY ./Pipfile.lock .

COPY ./app.py .
COPY ./docker-entrypoint.sh .

# Start Args

ENV SECRET_KEY="999_DEBUG_CHANGE_IN_PROD_999"
ENV DB_URI="sqlite:///:memory:"

ENV FLASK_APP=app.py
ENV WSGI_WORKERS=2

ENV DEBUG=False

# End Args

RUN pipenv install

# CMD [ \
# "bash", \
# "-c", \
# "export SECRET_KEY=$SECRET_KEY; \
# export DEBUG=$DEBUG; \
# export DB_URI=$DB_URI; \
# pipenv run flask db stamp head; \
# pipenv run flask db migrate; \
# pipenv run flask db upgrade; \
# pipenv run gunicorn -w $WSGI_WORKERS -b :5000 'receipt_split:create_app()'" \
# ]
#

CMD [ \
"bash", \
"-c", \
"./docker-entrypoint.sh \
--db-uri $DB_URI \
--secret-key $SECRET_KEY \
--wsgi-workers $WSGI_WORKERS" \
]
