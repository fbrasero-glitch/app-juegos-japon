import re
import os

files = ['restore_config.py', 'update_missions_final.py', 'add_new_missions.py']
all_missions = {}

for fn in files:
    if not os.path.exists(fn): continue
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Buscar TODOS los IDs de misiones
    # El formato es "id": { ... } o "id": """{ ... }"""
    # Usamos una regex que capture el ID y el bloque hasta la siguiente coma o llave de cierre del objeto padre
    matches = re.finditer(r'"(day_\d+_.*?|any_.*?)":\s*(?:"""|")(.*?)(?:"""|")', content, re.DOTALL)
    for m in matches:
        m_id = m.group(1)
        m_body = m.group(2)
        if m_id not in all_missions:
            all_missions[m_id] = m_body

# Guardar todo lo recuperado en un solo lugar
import json
with open('all_recovered_missions.json', 'w', encoding='utf-8') as out:
    json.dump(all_missions, out, indent=4)

print(f"Total missions recovered: {len(all_missions)}")

# Mostrar misiones por día para verificar
by_day = {}
for m_id in all_missions:
    day_match = re.search(r'day_(\d+)', m_id)
    day = day_match.group(1) if day_match else 'any'
    if day not in by_day: by_day[day] = []
    by_day[day].append(m_id)

for day in sorted(by_day.keys(), key=lambda x: int(x) if x.isdigit() else 999):
    print(f"Day {day}: {len(by_day[day])} missions")
