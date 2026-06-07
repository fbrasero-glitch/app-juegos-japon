import codecs
import re

VALID_KEYS = {
    "day_1_bingo", "day_1_balance", "day_1_engine", "day_1_clouds",
    "day_1_navigator", "day_1_timezone", "day_1_customs", "day_1_exchange", "day_1_bets",
    "day_2_yokai", "day_2_posture", "day_2_melody", "day_2_vending",
    "day_2_shogun", "day_2_maze", "day_2_kanji", "day_2_audit", "day_2_ekistamp",
    "day_3_glico", "day_3_ninja", "day_3_bridge", "day_3_umeda",
    "day_3_architect", "day_3_neon", "day_3_rush", "day_3_flow", "day_3_reflect",
    "day_4_bestiary", "day_4_gachapon", "day_4_vending_roulette", "day_4_crab",
    "day_4_knife", "day_4_500yen", "day_4_isshinji", "day_4_tracker", "day_4_yakiniku",
    "day_5_gymnast", "day_5_monk", "day_5_deer_galaxy", "day_5_ribbon",
    "day_5_investor", "day_5_zen", "day_5_engineer", "day_5_guardian", "day_5_mochi",
    "day_6_seal", "day_6_evasion", "day_6_clouds", "day_6_ninja_steps",
    "day_6_tactical", "day_6_edict", "day_6_time_travel", "day_6_ring", "day_6_clan",
    "day_7_kimono", "day_7_kintsugi", "day_7_tea", "day_7_stone_guardian",
    "day_7_structural", "day_7_survival", "day_7_anti_quake", "day_7_stairs", "day_7_geisha"
}

def purge(filepath):
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
        # The key includes "day_X_Y"
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
            
            # Check logic
            if day_num <= 7:
                if key_str in VALID_KEYS:
                    missions[key_str] = mission_str
            else:
                missions[key_str] = mission_str
                
            pos = obj_end + 1
        else:
            pos = match.end()
            
    # sort by day
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
        
    print(f"Purged old missions. Remaining valid missions: {len(sorted_missions)}")

purge('missions.js')
