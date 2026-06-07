import re
import codecs

with codecs.open('missions.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
ignore_mode = False
brace_count = 0

# Regex to detect mission start: "day_1_something": {
mission_start_re = re.compile(r'^\s*"day_([0-9]+)_[a-zA-Z0-9_]+"\s*:\s*\{')

for line in lines:
    if not ignore_mode:
        match = mission_start_re.search(line)
        if match:
            day = int(match.group(1))
            if day <= 7:
                ignore_mode = True
                brace_count = line.count('{') - line.count('}')
                continue # Skip this line
        new_lines.append(line)
    else:
        brace_count += line.count('{')
        brace_count -= line.count('}')
        if brace_count <= 0:
            ignore_mode = False
            brace_count = 0

with codecs.open('missions_cleaned.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Cleaned file written to missions_cleaned.js")
