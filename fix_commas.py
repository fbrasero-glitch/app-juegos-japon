import codecs
import re

with codecs.open('missions_cleaned.js', 'r', encoding='utf-8') as f:
    text = f.read()

# We can remove comments temporarily to find consecutive commas
# But we don't want to lose comments.
# Let's tokenize the file!
tokens = []
# Very simple regex tokenizer
# Matches Strings, Comments, Commas, and "Other"
pattern = re.compile(r'(?P<string>"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|`(?:\\.|[^`\\])*`)|(?P<comment>//.*|/\*[\s\S]*?\*/)|(?P<comma>,)|(?P<brace>})|(?P<other>[^"\'`/,}]+)|(?P<slash>/)')

pos = 0
last_meaningful_token = None
output = []

while pos < len(text):
    match = pattern.match(text, pos)
    if not match:
        output.append(text[pos])
        pos += 1
        continue
        
    if match.group('string'):
        output.append(match.group('string'))
        last_meaningful_token = 'string'
    elif match.group('comment'):
        output.append(match.group('comment'))
    elif match.group('comma'):
        if last_meaningful_token == 'comma' or last_meaningful_token == 'brace_start':
            # Skip this comma!
            pass
        else:
            output.append(',')
            last_meaningful_token = 'comma'
    elif match.group('brace'):
        if last_meaningful_token == 'comma':
            # Remove the trailing comma!
            # We can't easily remove it from output because of intervening comments, 
            # so we just let it be. JS allows trailing commas in objects and arrays!
            pass
        output.append('}')
        last_meaningful_token = 'brace'
    elif match.group('other'):
        s = match.group('other')
        output.append(s)
        if s.strip():
            # If it contains an opening brace, maybe we should track it
            if '{' in s:
                last_meaningful_token = 'brace_start'
            else:
                last_meaningful_token = 'other'
    elif match.group('slash'):
        output.append('/')
        last_meaningful_token = 'other'
        
    pos = match.end()

# Also, ensure no empty commas at the very start of MISSIONS_CONFIG = {
with codecs.open('missions_fixed.js', 'w', encoding='utf-8') as f:
    f.write("".join(output))

print("Fixed commas.")
