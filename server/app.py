from flke8ask import Flask, request, Response, render_template, abort
import os
import requests
import itertools
from flask_wtf.csrf import CSRFProtect
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, SelectField
from wtforms.validators import Regexp, Optional
import re

class WordForm(FlaskForm):
    avail_letters = StringField("Letters", validators=[
        Regexp(r'^[a-z]*$', message="must contain letters only"),
        Optional()
    ])

    letter_length = SelectField("Number of Letters", coerce=int, choices=[
        (-1, "")
        ] + [
            (x, str(x)) for x in range(3, 8+1)
        ])

    pattern_input = StringField("Pattern", validators=[
        Regexp(r'^[a-z.]*$', message="must contain letters or period"),
        Optional()
    ])

    submit = SubmitField("Go")

    def validate_on_submit(self):
        if not super(WordForm, self).validate_on_submit():
            return False

        avail_letters = self.avail_letters.data
        pattern_input = self.pattern_input.data

        if avail_letters == "" and pattern_input == "":
            msg = "At least one of Available Letters and Pattern must be set"
            self.avail_letters.errors.append(msg)
            # self.pattern_input.errors.append(msg)
            return False

        letter_length = self.letter_length.data

        if letter_length >= 0 and len(pattern_input) != letter_length:
            msg = "Length of pattern input doesn't match Number of letters"
            self.letter_length.errors.append(msg)
            return False
        return True

GOOD_WORDS = set()

with open('sowpods.txt') as f:
    GOOD_WORDS = set(x.strip().lower() for x in f.readlines())

API_KEY = "47e88093-0564-4013-bf39-65bed2ff30aa"
NAME = "Isaac Lo"

csrf = CSRFProtect()
app = Flask(__name__)
app.config["SECRET_KEY"] = "row the boat"
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
csrf.init_app(app)

def dir_last_updated(folder):
    return str(max(os.path.getmtime(os.path.join(root_path, f))
                   for root_path, dirs, files in os.walk(folder)
                   for f in files))

@app.route('/')
def index():
    form = WordForm()
    return render_template("index.html", form=form, name=NAME)

@app.route('/def/<word>', methods=['GET'])
def word_2_def(word):
    url = f"https://www.dictionaryapi.com/api/v3/references/collegiate/json/{word}?key={API_KEY}"
    try:
        req = requests.get(url)
        data = req.json()

        defs = data[0]["shortdef"]

        if defs == []:
            abort(404)

        return "\n".join(defs)
    except:
        abort(404)

@app.route('/words', methods=['POST', 'GET'])
def letters_2_words():

    form = WordForm()
    if form.validate_on_submit():
        letters = form.avail_letters.data
        pattern_input = form.pattern_input.data
        letter_length = form.letter_length.data if form.letter_length.data >= 0 else len(letters)
    else:
        return render_template("index.html", form=form)

    word_set = set()

    def add_to_set(word):
        w = "".join(word)
        if w in GOOD_WORDS:
            word_set.add(w)

    if letters == "":
        word_set = GOOD_WORDS
    else:
        for length in range(3, letter_length+1):
            for word in itertools.permutations(letters, length):
                add_to_set(word)

    if pattern_input != "":
        word_set = [w for w in word_set
                    if len(pattern_input) == len(w) and
                    re.match(pattern_input, w)]

    return render_template('wordlist.html',
                           wordlist=sorted(sorted(word_set), key=len),
                           name=NAME)




@app.route('/proxy')
def proxy():
    result = requests.get(request.args['url'])
    resp = Response(result.text)
    resp.headers['Content-Type'] = 'application/json'
    return resp
