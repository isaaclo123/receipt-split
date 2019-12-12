from import app
from flask import make_response


@app.route('/', methods=['GET'])
def show_entries():
    response = make_response("hi", 200)
    response.mimetype = "text/plain"
    return response
