import json

log_path = r'C:\Users\Usuario\\.gemini\antigravity\brain\93fd6ef6-2ac7-498b-b0b8-1e262801d7ce\.system_generated\logs\overview.txt'

with open(log_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if 'edicto' in line.lower():
            try:
                data = json.loads(line)
                content = data.get('tool_calls', [{}])[0].get('args', {}).get('CodeContent', '')
                if content:
                    try:
                        content = json.loads(content)
                    except:
                        pass
                    with open(f'dump_{i}.txt', 'w', encoding='utf-8') as df:
                        df.write(content)
                    print(f"Dumped content to dump_{i}.txt")
            except:
                pass
