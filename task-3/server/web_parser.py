from __future__ import unicode_literals

import logging
import re
from HTMLParser import HTMLParser
from collections import Counter

import requests

logger = logging.getLogger(__name__)


def get_page_content(url):
    try:
        r = requests.get(url, timeout=2)
        r.raise_for_status()
        return r.text
    except Exception as e:
        logger.error(e)
        return ''


def count_words_in_html(html):
    pos = 0
    text = ''
    skip_tags = ['script']

    def in_range(add=0):
        return pos + add < len(html)

    parser = HTMLParser()

    while in_range():
        if html[pos] == '<':
            if html[pos + 1] == '/':
                while in_range() and html[pos] != '>':
                    pos += 1
                pos += 1
            else:
                tag = ''
                pos += 1
                while in_range() and html[pos] != ' ' and html[pos] != '>':
                    tag += html[pos]
                    pos += 1
                while in_range() and html[pos] != '>':
                    pos += 1
                if html[pos - 1] == '/':
                    tag = None
                pos += 1
                if tag in skip_tags:
                    while in_range() and not html[pos:].startswith('</{}>'.format(tag)):
                        pos += 1
        else:
            while in_range() and html[pos] != '<':
                text += html[pos]
                pos += 1
            text += ' '

    text = parser.unescape(text)
    words = re.split(r'\W', text, flags=re.UNICODE)
    return list(Counter(words).iteritems())


if __name__ == '__main__':
    count_words_in_html(get_page_content('https://ya.ru'))
    # count_words_in_html(get_page_content('https://edu.susu.ru/'))
