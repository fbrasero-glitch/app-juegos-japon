import re

# Intentar leer en utf-16 o utf-8
try:
    with open('recovered_missions.txt', 'r', encoding='utf-16') as f:
        content = f.read()
except:
    with open('recovered_missions.txt', 'r', encoding='utf-8') as f:
        content = f.read()

# Buscar misiones de día 6
# En el log, las misiones estaban en un objeto MISSIONS = { ... }
# Vamos a buscar bloques que empiecen por "day_6"

matches = re.finditer(r'"(day_6_.*?)":\s*"""(.*?)"""', content, re.DOTALL)
for m in matches:
    m_id = m.group(1)
    m_body = m.group(2)
    print(f"ID: {m_id}")
    print(f"BODY: {m_body[:200]}...") # Solo un poco para verificar
    print("-" * 20)
