from flask_api.parsers import BaseParser
from flask_api import exceptions
from flask._compat import text_type
import simplejson


class SimpleJsonParser(BaseParser):
    media_type = 'application/json'

    def parse(self, stream, media_type, **options):
        data = stream.read().decode('utf-8')
        # print(data)
        try:
            print(data)
            return simplejson.loads(data)
        except ValueError as exc:
            msg = 'JSON parse error - %s' % text_type(exc)
            raise exceptions.ParseError(msg)
