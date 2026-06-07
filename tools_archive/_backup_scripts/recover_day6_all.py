import re

files = ['restore_config.py', 'update_missions_final.py', 'add_new_missions.py']
day6_missions = {}

for fn in files:
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()
    matches = re.finditer(r'"(day_6_.*?)":\s*"""(.*?)"""', content, re.DOTALL)
    for m in matches:
        m_id = m.group(1)
        m_body = m.group(2)
        if m_id not in day6_missions:
            day6_missions[m_id] = m_body

# Re-create the MISSIONS dictionary for Day 6
output = "{\n"
for m_id, m_body in day6_missions.items():
    output += f'    "{m_id}": {m_body.strip()},\n'
output += "}"

with open('day6_recovered.txt', 'w', encoding='utf-8') as out:
    out.write(output)

print(f"Total Day 6 missions recovered: {len(day6_missions)}")
