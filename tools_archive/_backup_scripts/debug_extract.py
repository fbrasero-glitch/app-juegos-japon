import os
import re

files = ['full_recovered_missions.py', 'recovered_missions.js']

for fn in files:
    if not os.path.exists(fn): continue
    print(f"Checking {fn}...")
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()
    
    indices = [m.start() for m in re.finditer('day_6', content)]
    for idx in indices:
        print(f"--- MATCH AT {idx} ---")
        print(content[idx:idx+500])
        print("-" * 50)
