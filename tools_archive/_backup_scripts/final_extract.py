import re
import os


files = ['full_recovered_missions.py', 'recovered_missions.js']
all_missions = {}

for fn in files:
    if not os.path.exists(fn): continue
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Buscar misiones de día 6
    # Patrón para misiones en diccionarios: "id": """{ ... }""" o "id": "{ ... }"
    matches = re.finditer(r'"(day_6_.*?)":\s*(?:"""|")(.*?)(?:"""|")', content, re.DOTALL)
    for m in matches:
        m_id = m.group(1)
        m_body = m.group(2)
        if m_id not in all_missions:
            all_missions[m_id] = m_body

print(f"Total Day 6 missions found: {len(all_missions)}")
for m_id, m_body in all_missions.items():
    print(f"--- {m_id} ---")
    print(m_body.strip())
    print("-" * 30)
