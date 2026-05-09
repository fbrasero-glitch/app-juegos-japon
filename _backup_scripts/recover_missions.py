import json

log_path = r'C:\Users\Usuario\\.gemini\antigravity\brain\93fd6ef6-2ac7-498b-b0b8-1e262801d7ce\.system_generated\logs\overview.txt'

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'update_missions_final.py' in line:
            try:
                data = json.loads(line)
                if 'tool_calls' in data:
                    for tc in data['tool_calls']:
                        if tc['name'] == 'write_to_file' and 'update_missions_final.py' in tc['args']['TargetFile']:
                            print(tc['args']['CodeContent'])
                            # Terminamos después de encontrar el más reciente (o todos)
            except:
                pass
