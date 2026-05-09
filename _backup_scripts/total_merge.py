import os
import re

def extract_from_file(filename):
    if not os.path.exists(filename): return {}
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Encontrar el inicio de MISSIONS o similar
    # A veces es MISSIONS = { , otras es un re.sub o similar.
    # Vamos a buscar los patrones de misiones directamente en el texto.
    
    # Buscar claves "day_X_...":
    mission_keys = re.findall(r'"(day_\d+_.*?|any_.*?)":', content)
    found = {}
    for i in range(len(mission_keys)):
        key = mission_keys[i]
        # Buscar el inicio después de "key":
        # Puede haber triple comillas o no.
        pattern = rf'"{key}":\s*(?:"""|")(.*?)(?:"""|")'
        # Pero si el cuerpo tiene comillas dentro, la regex de arriba fallará.
        # Mejor buscar el inicio y usar balanceo de llaves.
        start_search = content.find(f'"{key}":')
        if start_search == -1: continue
        
        brace_start = content.find('{', start_search)
        if brace_start == -1: continue
        
        count = 1
        idx = brace_start + 1
        while count > 0 and idx < len(content):
            if content[idx] == '{': count += 1
            elif content[idx] == '}': count -= 1
            idx += 1
        
        found[key] = content[brace_start:idx]
    return found

files = ['restore_config.py', 'update_missions_final.py', 'add_new_missions.py', 'fix_missions_final.py', 'add_physical_missions.py']
all_missions = {}

for fn in files:
    print(f"Extracting from {fn}...")
    m = extract_from_file(fn)
    print(f"  Found {len(m)} missions.")
    all_missions.update(m)

print(f"Total unique missions: {len(all_missions)}")

# Reconstruir app.js
tag_icons = 'const TAG_ICONS = { photo: "📷", video: "🎬", audio: "🎙️", writing: "✍️", versus: "⚔️", game: "🎮", sensors: "🧭", economy: "💰", physical: "🏃" };'
lines = [f'    "{k}": {v}' for k, v in all_missions.items()]
missions_config = "const MISSIONS_CONFIG = {\n" + ",\n".join(lines) + "\n};"

with open('app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

tag_start = app_content.find('const TAG_ICONS =')
switch_view_start = app_content.find('function switchView')
config_end = app_content.rfind('};', 0, switch_view_start) + 2

new_content = app_content[:tag_start] + tag_icons + "\n" + missions_config + "\n\n" + app_content[config_end:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(new_content)
