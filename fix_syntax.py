import codecs

with codecs.open('missions.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix escaping issues
content = content.replace(r'\`', '`')
content = content.replace(r'\${', '${')

with codecs.open('missions.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Syntax fixed.")
