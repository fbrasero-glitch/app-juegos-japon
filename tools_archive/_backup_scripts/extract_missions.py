import re

with open('recovered_missions.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar bloques de misiones en el diccionario MISSIONS
# El formato es "id": """{ ... }""" o "id": "{ ... }"
matches = re.finditer(r'"(day_6_.*?)":\s*"""(.*?)"""', content, re.DOTALL)
day6_missions = {}

for m in matches:
    m_id = m.group(1)
    m_body = m.group(2)
    day6_missions[m_id] = m_body

# Si no hay coincidencias con triple comilla, intentar comilla simple (aunque el log sugería triple)
if not day6_missions:
    matches = re.finditer(r'"(day_6_.*?)":\s*"(.*?)"', content, re.DOTALL)
    for m in matches:
        m_id = m.group(1)
        m_body = m.group(2)
        day6_missions[m_id] = m_body

for m_id, m_body in day6_missions.items():
    print(f"--- MISSION: {m_id} ---")
    print(m_body)
    print("\n")
