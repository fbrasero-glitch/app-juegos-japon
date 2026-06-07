import re
import json

log_path = r'C:\Users\Usuario\\.gemini\antigravity\brain\93fd6ef6-2ac7-498b-b0b8-1e262801d7ce\.system_generated\logs\overview.txt'

titles_to_find = ["El Edicto del Emperador", "Plan de Infiltración Ninja", "Viaje en el Tiempo", "El Jardín de las Nubes Verdes"]

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        found_any = False
        for t in titles_to_find:
            if t in line:
                found_any = True
                break
        
        if found_any:
            try:
                data = json.loads(line)
                content = data.get('tool_calls', [{}])[0].get('args', {}).get('CodeContent', '')
                if not content: continue
                
                # Descomprimir el contenido si es un string escapado
                try:
                    content = json.loads(content)
                except:
                    pass
                
                # Buscar el bloque de la misión
                for t in titles_to_find:
                    # Buscar el ID de la misión (estará cerca del título)
                    # El formato suele ser "id": { ... title: "title" ... }
                    # O "id": """{ ... title: "title" ... }"""
                    pattern = rf'\"(day_6_.*?)\":\s*(?:\"\"\"|)\s*\{{.*?title:\s*\"{t}\".*?\}}'
                    match = re.search(pattern, content, re.DOTALL)
                    if match:
                        print(f"--- FOUND MISSION ---")
                        print(f"ID: {match.group(1)}")
                        # Extraer el bloque completo { ... }
                        # Buscamos el inicio { y el fin } balanceado
                        start_pos = content.find('{', match.start())
                        count = 0
                        end_pos = start_pos
                        for i in range(start_pos, len(content)):
                            if content[i] == '{': count += 1
                            elif content[i] == '}': count -= 1
                            if count == 0:
                                end_pos = i + 1
                                break
                        print(content[start_pos:end_pos])
                        print("-" * 20)
            except:
                pass
