FROM zapier/python-node

# docker
WORKDIR /srv/receipt-split
COPY ./docker-entrypoint.sh .

# python
COPY ./migrations/ ./migrations/
COPY ./receipt_split/ ./receipt_split/
COPY ./config.py .
COPY ./Pipfile .
COPY ./Pipfile.lock .

# node
COPY package*.json ./
COPY ./src/ ./src/
COPY ./config/ ./config/
COPY ./public/ ./public/
COPY ./scripts/ ./scripts/
COPY static.json ./
COPY tsconfig.json ./

# -- Start Vars --

ENV SECRET_KEY="999_DEBUG_CHANGE_IN_PROD_999"
ENV DB_URI="sqlite:////srv/receipt-split/app.db.sqlite3"

# flask
ENV WSGI_WORKERS=2
ENV FLASK_ENV=production
ENV FLASK_APP=receipt_split:app

# react
ENV REACT_APP_API_URL_PRODUCTION=""
ENV NODE_ENV="production"

# -- End Vars --

# python
RUN pip install pipenv
RUN pipenv install

# node
RUN npm install
RUN npm run build

CMD [ \
"bash", \
"-c", \
"./docker-entrypoint.sh \
--db-uri $DB_URI \
--secret-key $SECRET_KEY \
--wsgi-workers $WSGI_WORKERS" \
]
