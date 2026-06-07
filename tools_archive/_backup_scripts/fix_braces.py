import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the MISSIONS_CONFIG content
config_match = re.search(r'(const MISSIONS_CONFIG = \{)(.*?)(\n\};)', content, re.DOTALL)
if not config_match:
    print("MISSIONS_CONFIG not found")
    exit()

header = config_match.group(1)
config_str = config_match.group(2)
footer = config_match.group(3)

# Find all mission definitions: "key": {
# We use a regex that matches the key and then we manually find the closing brace for that mission
mission_pattern = re.compile(r'\"(?P<id>day_.*?|any_.*?)\":\s*\{', re.DOTALL)
missions = []
last_pos = 0

for match in mission_pattern.finditer(config_str):
    m_id = match.group('id')
    start_idx = match.start()
    
    # We find the closing brace for this mission
    # This is tricky because it has nested braces
    brace_count = 1
    idx = match.end()
    while brace_count > 0 and idx < len(config_str):
        if config_str[idx] == '{': brace_count += 1
        elif config_str[idx] == '}': brace_count -= 1
        idx += 1
    
    # The mission block is config_str[start_idx:idx]
    mission_block = config_str[start_idx:idx].strip()
    
    # Ensure it ends with } and potentially a comma
    if not mission_block.endswith('}'):
        # If it doesn't end with }, it's likely missing the closing brace
        mission_block += '\n    }'
    
    missions.append(mission_block)

# Join them with commas
new_config_str = '\n    ' + ',\n    '.join(missions) + '\n'
new_content = content[:config_match.start()] + header + new_config_str + footer + content[config_match.end():]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Braces fixed.")
