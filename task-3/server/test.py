import web_parser as wp

html = wp.get_page_content('https://ya.ru')
print(wp.count_words_in_html(html))
