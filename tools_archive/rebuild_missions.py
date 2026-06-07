import codecs
import re

def rebuild(filepath):
    with codecs.open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    start_idx = content.find('const MISSIONS_CONFIG = {')
    if start_idx == -1:
        print("Could not find MISSIONS_CONFIG")
        return

    body_start = start_idx + len('const MISSIONS_CONFIG = {')
    
    missions = {} # Map to store the LAST definition of each key
    pattern = re.compile(r'"day_(\d+)_([^"]+)"\s*:\s*\{')
    
    pos = body_start
    while True:
        match = pattern.search(content, pos)
        if not match:
            break
            
        day_num = int(match.group(1))
        key_str = f"day_{day_num}_{match.group(2)}"
        key_start = match.start()
        obj_start = match.end() - 1
        
        brace_count = 0
        in_string = False
        string_char = ''
        in_escape = False
        obj_end = -1
        
        for i in range(obj_start, len(content)):
            char = content[i]
            if in_escape:
                in_escape = False; continue
            if char == '\\':
                in_escape = True; continue
            if in_string:
                if char == string_char: in_string = False
            else:
                if char in ('"', "'", '`'):
                    in_string = True; string_char = char
                elif char == '{': brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        obj_end = i; break
                        
        if obj_end != -1:
            mission_str = content[key_start:obj_end+1]
            # Always overwrite, so we keep the LAST definition
            missions[key_str] = mission_str
            pos = obj_end + 1
        else:
            print(f"Failed to find end for {key_str}")
            pos = match.end()
            
    print(f"Extracted {len(missions)} unique missions.")

    # Convert dictionary values to a list, sort them by day
    # Actually, order doesn't matter for the JS object, but it's cleaner to sort by day
    # We can extract day from key
    def get_day(m_str):
        match = re.search(r'"day_(\d+)_', m_str)
        if match: return int(match.group(1))
        return 999
        
    sorted_missions = sorted(missions.values(), key=get_day)

    new_content = "// ==========================================\n// 3. CONFIGURACIÓN DE MISIONES\n// ==========================================\n\nconst MISSIONS_CONFIG = {\n"
    new_content += ",\n\n".join(sorted_missions)
    new_content += "\n};\n"

    with codecs.open('missions.js', 'w', encoding='utf-8') as f:
        f.write(new_content)

rebuild('missions.js')
