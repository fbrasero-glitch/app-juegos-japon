import re

with open('restore_config.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar bloques de misiones en el diccionario MISSIONS
# El formato es "id": """{ ... }"""
matches = re.finditer(r'"(day_6_.*?)":\s*"""(.*?)"""', content, re.DOTALL)
day6_missions = {}

for m in matches:
    m_id = m.group(1)
    m_body = m.group(2)
    day6_missions[m_id] = m_body

print(f"Total Day 6 missions found in restore_config.py: {len(day6_missions)}")
for m_id, m_body in day6_missions.items():
    print(f"--- {m_id} ---")
    print(m_body.strip())
    print("-" * 30)
