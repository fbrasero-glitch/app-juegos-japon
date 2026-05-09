import re
import os

def normalize(text):
    if not text: return ""
    return re.sub(r'[^\w\s]', '', text.lower()).strip()

# 1. Parsear detalle_misiones.txt
missions_data = {}
current_day = 0

with open('detalle_misiones.txt', 'r', encoding='utf-8') as f:
    block = ""
    for line in f:
        if "--- DÍA" in line:
            current_day = int(re.search(r'\d+', line).group())
        
        if "📍 LUGAR:" in line:
            if block: # Procesar bloque anterior
                pass # (No es el mejor parsing, mejor por separadores)
        
        block += line
        if "--------------------" in line or line.strip() == "":
            # Procesar bloque acumulado
            loc_m = re.search(r'📍 LUGAR:\s*(.*)', block)
            title_m = re.search(r'🏆 MISIÓN:\s*(.*?)\s*\((\d+)\s*XP\)', block)
            desc_m = re.search(r'📝 DESCRIPCIÓN:\s*(.*)', block)
            
            if title_m:
                title = title_m.group(1).strip()
                loc = loc_m.group(1).strip() if loc_m else ""
                desc = desc_m.group(1).strip() if desc_m else ""
                xp = title_m.group(2)
                
                missions_data[normalize(title)] = {
                    "title": title,
                    "location": loc,
                    "description": desc,
                    "xp": int(xp)
                }
            block = ""

# 2. Leer app.js
with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 3. Función para enriquecer un bloque de misión
def enrich_mission(m_id, m_body):
    # Extraer el título actual
    title_match = re.search(r'title:\s*"(.*?)"', m_body)
    if not title_match: return m_body
    
    orig_title = title_match.group(1)
    norm_title = normalize(orig_title)
    
    # Buscar en missions_data
    if norm_title in missions_data:
        data = missions_data[norm_title]
        
        # Actualizar Título y Localización si es necesario
        m_body = re.sub(r'title:\s*".*?"', f'title: "{data["title"]}"', m_body)
        m_body = re.sub(r'location:\s*".*?"', f'location: "{data["location"]}"', m_body)
        
        # Enriquecer Descripción en el render
        # Buscamos <p class="mission-desc">...</p>
        desc_pattern = r'<p class=\\"mission-desc\\">(.*?)</p>'
        if '<p class=\\"mission-desc\\">' in m_body:
            m_body = re.sub(desc_pattern, f'<p class=\\"mission-desc\\">{data["description"]}</p>', m_body)
        elif '<p class="mission-desc">' in m_body:
            m_body = re.sub(r'<p class="mission-desc">(.*?)</p>', f'<p class="mission-desc">{data["description"]}</p>', m_body)
            
    return m_body

# 4. Procesar MISSIONS_CONFIG
# Extraer el bloque completo
config_match = re.search(r'const MISSIONS_CONFIG = \{(.*?)\};', content, re.DOTALL)
if config_match:
    config_inner = config_match.group(1)
    
    # Extraer cada misión usando balanceo de llaves
    missions = {}
    idx = 0
    while True:
        m_match = re.search(r'"(day_.*?|any_.*?)":\s*\{', config_inner[idx:])
        if not m_match: break
        
        m_id = m_match.group(1)
        m_start = idx + m_match.start()
        
        # Encontrar el fin del objeto { ... }
        brace_start = config_inner.find('{', m_start)
        count = 1
        pos = brace_start + 1
        while count > 0 and pos < len(config_inner):
            if config_inner[pos] == '{': count += 1
            elif config_inner[pos] == '}': count -= 1
            pos += 1
        
        m_body = config_inner[brace_start:pos]
        missions[m_id] = enrich_mission(m_id, m_body)
        idx = pos

    # Reconstruir el bloque
    new_inner = "\n" + ",\n".join([f'    "{k}": {v}' for k, v in missions.items()]) + "\n"
    content = content.replace(config_inner, new_inner)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Misiones enriquecidas con descripciones narrativas.")
