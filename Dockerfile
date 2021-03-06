# node build

FROM node:12-slim AS builder

WORKDIR /receipt-split

# node
COPY ./src/ ./src/
COPY ./config/ ./config/
COPY ./public/ ./public/
COPY ./scripts/ ./scripts/

COPY [ \
"package-lock.json", \
"package.json", \
"static.json", \
"tsconfig.json", \
"./" \
]

# node
RUN npm ci

# react
ENV REACT_APP_API_URL_PRODUCTION=''
ENV NODE_ENV=production

RUN npm run build

# python build

FROM python:3.7-slim

# docker
WORKDIR /srv/receipt-split

# -- Start Vars --

ENV SECRET_KEY="999_DEBUG_CHANGE_IN_PROD_999"
ENV DB_URI="sqlite:////srv/receipt-split/app.db.sqlite3"

# flask
ENV WSGI_WORKERS=2
ENV FLASK_ENV=production
ENV FLASK_APP=receipt_split:app

# -- End Vars --

COPY --from=builder /receipt-split/build/ ./build

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
