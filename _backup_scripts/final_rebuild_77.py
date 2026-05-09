import json
import os
import re

with open('all_recovered_missions.json', 'r', encoding='utf-8') as f:
    missions = json.load(f)

# Generar el bloque MISSIONS_CONFIG
lines = []
for m_id, m_body in missions.items():
    # El body ya es un objeto JS en formato string
    # Pero vamos a asegurar que no tenga las triple comillas si las tuviera (json.load ya las quitó si estaban fuera)
    # Sin embargo, el body puede contener caracteres especiales.
    lines.append(f'    "{m_id}": {m_body.strip()}')

missions_config = "const MISSIONS_CONFIG = {\n" + ",\n".join(lines) + "\n};"

tag_icons = 'const TAG_ICONS = { photo: "📷", video: "🎬", audio: "🎙️", writing: "✍️", versus: "⚔️", game: "🎮", sensors: "🧭", economy: "💰", physical: "🏃" };'

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

tag_start = content.find('const TAG_ICONS =')
switch_view_start = content.find('function switchView')
config_end = content.rfind('};', 0, switch_view_start) + 2

new_content = content[:tag_start] + tag_icons + "\n" + missions_config + "\n\n" + content[config_end:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"app.js actualizado con {len(missions)} misiones.")
