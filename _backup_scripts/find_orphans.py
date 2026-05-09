import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find orphan attachEvents: blocks that follow a closing brace and some whitespace
# but are NOT inside a key: { ... } structure (well, basically they follow a }, which ends a mission)
# Pattern: }, followed by whitespace and then attachEvents:
matches = list(re.finditer(r'\},\s+attachEvents:', content))
orphans = []

for m in matches:
    line = content.count('\n', 0, m.start()) + 1
    print(f"Found orphan at line {line}")

    # Find the end of this block by counting braces
    start_idx = m.start() + 2 # Skip the }
    # Find the first {
    brace_start = content.find('{', m.start())
    if brace_start == -1: continue
    
    count = 1
    idx = brace_start + 1
    while count > 0 and idx < len(content):
        if content[idx] == '{': count += 1
        elif content[idx] == '}': count -= 1
        idx += 1
    
    # The block ends at idx. Check if followed by },
    if content[idx:idx+2] == '},':
        idx += 2
    
    orphans.append((start_idx, idx))

# Remove in reverse order
for start, end in reversed(orphans):
    content = content[:start] + content[end:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Removed {len(orphans)} orphan blocks.")
