from suds.cache import NoCache
from suds.client import Client

client = Client('http://127.0.0.1:8000/?wsdl', cache=NoCache())
print(client.service.count_one_word('punk punk', 'punk'))
print(client.service.count_characters('punk punk'))
print(client.service.count_words('punk punk word'))
print(client.service.make_caps('punk punk word'))
print(client.service.count_words_on_web_page('https://ya.ru'))
# print(client.service.count_words_on_web_page('https://edu.susu.ru/'))
