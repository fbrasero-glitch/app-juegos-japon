import os

log_path = r'C:\Users\Usuario\\.gemini\antigravity\brain\93fd6ef6-2ac7-498b-b0b8-1e262801d7ce\.system_generated\logs\overview.txt'

with open(log_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if '"step_index":530' in line:
            print(f"Line {i} length: {len(line)}")
            # Encontrar el CodeContent
            target = '"CodeContent":"'
            start = line.find(target)
            if start != -1:
                start += len(target)
                # Buscar el final del CodeContent. Como es JSON, debería terminar antes de la siguiente clave del objeto tool_call
                # que es "Description"
                end = line.find('","Description"', start)
                if end != -1:
                    print(f"Extracted content length: {end - start}")
                    content = line[start:end]
                    # Salvar a un archivo
                    with open('full_content_raw.txt', 'w', encoding='utf-8') as out:
                        out.write(content)
