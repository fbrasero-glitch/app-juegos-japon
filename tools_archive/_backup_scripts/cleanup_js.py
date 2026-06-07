import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix double closing braces within MISSIONS_CONFIG
# This usually happens if the previous script removed an attachEvents but left its closing brace
content = re.sub(r'\},\s+\},', '},', content)

# Fix mission objects that were squashed into one line (e.g. },"id": {)
content = re.sub(r'\},\"', '},\n    \"', content)

# Fix missing commas if any (optional but good)
# content = re.sub(r'\}\s+\"', '},\n    \"', content)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Cleanup script finished.")
