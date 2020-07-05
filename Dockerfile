FROM python:3.8

RUN pip install pipenv

WORKDIR /srv/receipt-split
COPY ./receipt_split/ ./receipt_split/
COPY ./app.py .
COPY ./config.py .
COPY ./Pipfile .
COPY ./Pipfile.lock .

RUN pipenv install

ENV SECRET_KEY "999_DEBUG_CHANGE_IN_PROD"
ENV FLASK_APP app.py
ENV DEBUG True

RUN pipenv run flask db init
RUN pipenv run flask db migrate
RUN pipenv run flask db upgrade

CMD [ "pipenv", "run", "gunicorn", "-w", "1", "-b", ":5000", "receipt_split:create_app()" ]
