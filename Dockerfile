# FROM node:10.22.0 AS builder
#
# WORKDIR /srv/receipt-split
#
# # node
# COPY ./src/ ./src/
# COPY ./config/ ./config/
# COPY ./public/ ./public/
# COPY ./scripts/ ./scripts/
# COPY ./node_modules/ ./node_modules/
#
# COPY [ \
# "package-lock.json", \
# "package.json", \
# "static.json", \
# "tsconfig.json", \
# "./" \
# ]
#
# # react
# ENV REACT_APP_API_URL_PRODUCTION=''
# ENV NODE_ENV=production
#
# # node
# RUN npm install
# RUN npm run build
#
FROM python:3.7

# docker
WORKDIR /srv/receipt-split

# react files (must build outside before running docker image)
# COPY --from=builder /srv/receipt-split/build/ ./build
COPY ./build/ ./build/

# python
COPY ./migrations/ ./migrations/
COPY ./receipt_split/ ./receipt_split/

COPY [ \
"docker-entrypoint.sh", \
"config.py", \
"Pipfile", \
"Pipfile.lock", \
"./" \
]

# -- Start Vars --

ENV SECRET_KEY="999_DEBUG_CHANGE_IN_PROD_999"
ENV DB_URI="sqlite:////srv/receipt-split/app.db.sqlite3"

# flask
ENV WSGI_WORKERS=2
ENV FLASK_ENV=production
ENV FLASK_APP=receipt_split:app

# -- End Vars --

# python
RUN pip install pipenv
RUN pipenv install

CMD [ \
"bash", \
"-c", \
"./docker-entrypoint.sh \
--db-uri $DB_URI \
--secret-key $SECRET_KEY \
--wsgi-workers $WSGI_WORKERS" \
]
