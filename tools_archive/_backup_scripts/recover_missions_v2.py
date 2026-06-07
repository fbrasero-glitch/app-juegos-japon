import json
import os

log_path = r'C:\Users\Usuario\\.gemini\antigravity\brain\93fd6ef6-2ac7-498b-b0b8-1e262801d7ce\.system_generated\logs\overview.txt'

found_code = None

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'update_missions_final.py' in line:
            try:
                data = json.loads(line)
                if 'tool_calls' in data:
                    for tc in data['tool_calls']:
                        if tc['name'] == 'write_to_file' and 'update_missions_final.py' in tc['args']['TargetFile']:
                            found_code = tc['args']['CodeContent']
            except Exception as e:
                pass

if found_code:
    # El CodeContent es un string JSON escapado (ej. "\"import re\\n...\"")
    # Pero json.loads ya lo decodificó como string una vez si venía de un objeto JSON.
    # Si viene del log de antigravity, a veces es doblemente escapado.
    if found_code.startswith('"'):
        try:
            # Intentar decodificar como string JSON
            found_code = json.loads(found_code)
        except:
            pass
    
    with open('recovered_missions.js', 'w', encoding='utf-8') as f:
        f.write(found_code)
    print("Misiones recuperadas en recovered_missions.js")
else:
    print("No se encontró el bloque de misiones.")
