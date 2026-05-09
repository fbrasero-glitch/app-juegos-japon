import os
import re

with open('restore_config.py', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('MISSIONS = {')
if start_idx == -1:
    print("No se encontró MISSIONS")
    exit()

start_idx += len('MISSIONS = ')
count = 1
idx = content.find('{', start_idx) + 1
while count > 0 and idx < len(content):
    if content[idx] == '{': count += 1
    elif content[idx] == '}': count -= 1
    idx += 1

missions_dict_str = content[start_idx:idx]
mission_keys = re.findall(r'"(day_\d+_.*?|any_.*?)":', missions_dict_str)

missions_final = {}
for i in range(len(mission_keys)):
    key = mission_keys[i]
    # Buscar el ID incluyendo las comillas para evitar coincidencias parciales
    start = missions_dict_str.find(f'"{key}":') + len(f'"{key}":')
    if i < len(mission_keys) - 1:
        end = missions_dict_str.find(f'"{mission_keys[i+1]}":')
        body = missions_dict_str[start:end].strip()
        if body.endswith(','): body = body[:-1].strip()
    else:
        body = missions_dict_str[start:].strip()
        if body.endswith('}'): body = body[:-1].strip()

    if body.startswith('"""') and body.endswith('"""'):
        body = body[3:-3].strip()
    
    missions_final[key] = body

print(f"Recuperadas {len(missions_final)} misiones.")

tag_icons = 'const TAG_ICONS = { photo: "📷", video: "🎬", audio: "🎙️", writing: "✍️", versus: "⚔️", game: "🎮", sensors: "🧭", economy: "💰", physical: "🏃" };'

lines = []
for k, v in missions_final.items():
    lines.append(f'    "{k}": {v}')

missions_config = "const MISSIONS_CONFIG = {\n" + ",\n".join(lines) + "\n};"

with open('app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

tag_start = app_content.find('const TAG_ICONS =')
switch_view_start = app_content.find('function switchView')
config_end = app_content.rfind('};', 0, switch_view_start) + 2

new_content = app_content[:tag_start] + tag_icons + "\n" + missions_config + "\n\n" + app_content[config_end:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(new_content)
