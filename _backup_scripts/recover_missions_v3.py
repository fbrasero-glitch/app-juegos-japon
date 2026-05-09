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
            except:
                pass

if found_code:
    # Decodificar el string JSON
    # CodeContent es algo como "\"import re\\n...\""
    decoded = json.loads(found_code)
    
    with open('recovered_missions.py', 'w', encoding='utf-8') as f:
        f.write(decoded)
    print("Misiones recuperadas en recovered_missions.py")
else:
    print("No se encontró el bloque de misiones.")
