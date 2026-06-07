import os

log_path = r'C:\Users\Usuario\\.gemini\antigravity\brain\93fd6ef6-2ac7-498b-b0b8-1e262801d7ce\.system_generated\logs\overview.txt'

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if '"step_index":530' in line:
            # Encontrar "CodeContent":"
            start_str = '"CodeContent":"'
            start_idx = line.find(start_str)
            if start_idx != -1:
                start_idx += len(start_str)
                # El string termina en un " que no está escapado
                # Pero como es un JSON gigante, vamos a buscar el final de la cadena
                # El siguiente campo es "Description":"
                end_idx = line.find('","Description":', start_idx)
                if end_idx != -1:
                    raw_content = line[start_idx:end_idx]
                    # Des-escapar el string (\n, \", etc)
                    # Python's bytes.decode('unicode_escape') is good for this
                    # Pero primero hay que asegurar que los backslashes son correctos
                    decoded = raw_content.encode('utf-8').decode('unicode_escape')
                    
                    with open('full_recovered_missions.py', 'w', encoding='utf-8') as df:
                        df.write(decoded)
                    print("Misiones recuperadas exitosamente.")
                    break
