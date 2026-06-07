import re

log_path = r'C:\Users\Usuario\\.gemini\antigravity\brain\93fd6ef6-2ac7-498b-b0b8-1e262801d7ce\.system_generated\logs\overview.txt'

with open(log_path, 'r', encoding='utf-8') as f:
    log_content = f.read()

# Buscar el bloque MISSIONS = {
start_match = re.search(r'MISSIONS = \{', log_content)
if start_match:
    start_idx = start_match.start()
    # Buscar el final del diccionario (llave de cierre balanceada)
    count = 0
    idx = start_idx + len('MISSIONS = ')
    found_end = False
    
    # Este diccionario usa triple comilla para los valores, lo que complica el conteo simple
    # Pero podemos buscar el final de la asignación del diccionario
    # En el log, el diccionario termina antes del siguiente campo del JSON o del final del CodeContent
    
    # Alternativa: Buscar todas las claves "day_X_..."
    missions_found = re.findall(r'\\"(day_6_.*?)\\"', log_content)
    print(f"Misiones de día 6 encontradas en el log: {missions_found}")
    
    # Extraer el contenido de Kid 14 Día 6 específicamente
    for m_id in missions_found:
        if 'kid14' in m_id or 'fam' in m_id:
            # Buscar el cuerpo de esta misión
            pattern = rf'\\"{m_id}\\":\s*\\"(.*?)\\"'
            m_body = re.search(pattern, log_content)
            if m_body:
                print(f"--- {m_id} ---")
                # El cuerpo está doblemente escapado en el log
                body = m_body.group(1).replace('\\\\n', '\n').replace('\\"', '"').replace('\\\\"', '\\"')
                print(body)
                print("-" * 20)
else:
    print("No se encontró MISSIONS = {")
