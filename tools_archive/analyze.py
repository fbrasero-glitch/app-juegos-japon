import re
import collections

text = open('missions.js','r',encoding='utf-8').read()
matches = re.findall(r'"day_(\d+)_([^"]+)"\s*:\s*\{', text)

# matches is a list of tuples (day, key)
# let's group by day and see how many unique keys per day
day_keys = collections.defaultdict(set)
for day, key in matches:
    day_keys[int(day)].add(key)

for day in sorted(day_keys.keys()):
    print(f"Day {day}: {len(day_keys[day])} unique keys")
