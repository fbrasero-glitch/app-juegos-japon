const fs = require('fs');

// 1. Read the original bloated file
let code = fs.readFileSync('missions.js', 'utf8');

// 2. Mock some DOM objects so eval doesn't fail if there's any immediate execution (there shouldn't be)
global.document = {};
global.window = {};

// 3. Evaluate to get the object in memory
// Replace const MISSIONS_CONFIG with global.MISSIONS_CONFIG
code = code.replace(/const\s+MISSIONS_CONFIG\s*=/, 'global.MISSIONS_CONFIG =');
try {
    eval(code);
} catch(e) {
    console.error("Eval failed", e);
    process.exit(1);
}

const config = global.MISSIONS_CONFIG;

// 4. We want to keep:
// - All keys for Day > 7
// - Only the VALID keys for Day <= 7
const VALID_KEYS = new Set([
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
]);

const cleanedConfig = {};

for (const key of Object.keys(config)) {
    const mission = config[key];
    const day = mission.day;
    if (day <= 7) {
        if (VALID_KEYS.has(key)) {
            cleanedConfig[key] = mission;
        }
    } else {
        cleanedConfig[key] = mission;
    }
}

// Now we have the perfect cleanedConfig object. We just need to serialize it.
function serialize(obj, indent) {
    let parts = [];
    for (const key in obj) {
        let val = obj[key];
        let valStr = "";
        
        if (typeof val === 'function') {
            valStr = val.toString();
        } else if (typeof val === 'string') {
            // Need to handle backticks safely if we use them? No, we can just use JSON.stringify for strings
            valStr = JSON.stringify(val);
        } else if (typeof val === 'number') {
            valStr = val.toString();
        } else if (typeof val === 'object') {
            valStr = serialize(val, indent + "    ");
        }
        
        parts.push(`${indent}    "${key}": ${valStr}`);
    }
    return `{\n${parts.join(",\n")}\n${indent}}`;
}

// Since the top level is missions, we format it nicely
let finalOutput = "// ==========================================\n// 3. CONFIGURACIÓN DE MISIONES\n// ==========================================\n\nconst MISSIONS_CONFIG = {\n";

let missionStrings = [];
for (const key in cleanedConfig) {
    const m = cleanedConfig[key];
    let props = [];
    for (const prop in m) {
        let val = m[prop];
        if (typeof val === 'function') {
            props.push(`        ${prop}: ${val.toString()}`);
        } else if (typeof val === 'string') {
            props.push(`        ${prop}: ${JSON.stringify(val)}`);
        } else if (typeof val === 'number') {
            props.push(`        ${prop}: ${val}`);
        }
    }
    missionStrings.push(`    "${key}": {\n${props.join(",\n")}\n    }`);
}

finalOutput += missionStrings.join(",\n\n");
finalOutput += "\n};\n";

fs.writeFileSync('missions.js', finalOutput);
console.log("Successfully rebuilt missions.js");
