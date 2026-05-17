"""
Purge duplicate missions from Days 22-24 in missions.js

Duplicates to remove:
  Day 22: day_22_kid9_pescadero, day_22_kid14_ginza, day_22_kid14_radio
  Day 23: day_23_kid9_kitkat, day_23_kid9_pokedex
  Day 24: day_24_fam_sayonara
"""
import codecs
import re

KEYS_TO_REMOVE = {
    "day_22_kid9_pescadero",
    "day_22_kid14_ginza",
    "day_22_kid14_radio",
    "day_23_kid9_kitkat",
    "day_23_kid9_pokedex",
    "day_24_fam_sayonara",
}

def purge_missions(filepath):
    with codecs.open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    new_lines = []
    skip_mode = False
    brace_depth = 0
    removed_keys = []

    i = 0
    while i < len(lines):
        line = lines[i]

        # Check if this line starts a mission we want to remove
        match = re.match(r'\s*"(day_\d+_[^"]+)"\s*:\s*\{', line)
        if match and match.group(1) in KEYS_TO_REMOVE:
            # Start skipping this mission block
            skip_mode = True
            brace_depth = line.count('{') - line.count('}')
            removed_keys.append(match.group(1))
            i += 1
            continue

        if skip_mode:
            brace_depth += line.count('{') - line.count('}')
            if brace_depth <= 0:
                skip_mode = False
                # Check if there's a trailing comma on the closing line
                # Don't add this line (it's the closing brace of the removed block)
            i += 1
            continue

        new_lines.append(line)
        i += 1

    # Clean up any double commas that might result from removal
    result = '\n'.join(new_lines)
    # Remove lines that are just commas after removal
    result = re.sub(r',\s*,', ',', result)

    with codecs.open(filepath, 'w', encoding='utf-8') as f:
        f.write(result)

    print(f"Removed {len(removed_keys)} duplicate missions: {removed_keys}")

if __name__ == '__main__':
    purge_missions('missions.js')
