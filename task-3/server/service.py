# coding: utf-8

from __future__ import unicode_literals

import logging
import re
from wsgiref.simple_server import make_server

from spyne import Application, rpc, ServiceBase, Iterable, Integer, Unicode, ComplexModel
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication

from web_parser import get_page_content, count_words_in_html

logger = logging.getLogger(__name__)


class WordCount(ComplexModel):
    word = Unicode
    count = Integer


class CharCount(ComplexModel):
    char = Unicode
    count = Integer


class GlobalTextAnalyzer(ServiceBase):

    @rpc(Unicode, Unicode, _returns=Integer)
    def count_one_word(self, text, word):
        return sum(word == text_word for text_word in re.split(r'\W', text, flags=re.UNICODE))

    @rpc(Unicode, _returns=Iterable(CharCount))
    def count_characters(self, text):
        char_counts = {}
        for c in text:
            if c not in char_counts:
                char_counts[c] = 0
            char_counts[c] += 1
        for char, count in char_counts.iteritems():
            yield CharCount(char=char, count=count)

    @rpc(Unicode, _returns=Iterable(WordCount))
    def count_words(self, text):
        word_counts = {}
        for word in re.split(r'\W', text, flags=re.UNICODE):
            if word not in word_counts:
                word_counts[word] = 0
            word_counts[word] += 1
        for word, count in word_counts.iteritems():
            yield WordCount(word=word, count=count)

    @rpc(Unicode, _returns=Unicode)
    def make_caps(self, text):
        return text.upper()

    @rpc(Unicode, _returns=Iterable(WordCount))
    def count_words_on_web_page(self, url):

        html = get_page_content(url)
        for word, count in count_words_in_html(html):
            yield WordCount(word=word, count=count)


application = Application([GlobalTextAnalyzer], 'GlobalTextAnalyzer',
                          in_protocol=Soap11(validator='lxml'),
                          out_protocol=Soap11())

wsgi_application = WsgiApplication(application)

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    logging.getLogger('spyne.protocol.xml').setLevel(logging.DEBUG)

    server = make_server('0.0.0.0', 8000, wsgi_application)
    server.serve_forever()
