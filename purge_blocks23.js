// PURGE: Remove all duplicate/old missions from Days 8-21
// Pattern: missions with tag:undefined OR duplicate titles are OLD versions
const fs = require('fs');
let lines = fs.readFileSync('missions.js', 'utf8').split('\n');

// Keys to REMOVE (identified by tag:undefined, duplicate titles, or old naming convention)
const toRemove = [
    // Day 8 - has 18, need 9. Keep the 9 newer ones, remove 9 old
    'day_8_kid9_buda',        // dup of day_8_kid9_pose (photo kid9)
    'day_8_kid14_twin',       // old version
    'day_8_kid9_guardian',    // dup photo kid9
    'day_8_kid14_bamboo_eng', // old version
    'day_8_kid14_codigo',     // old version
    'day_8_kid9_rake',        // old version 
    'day_8_fam_silencio',     // old version
    'day_8_kid9_drum',        // old version
    'day_8_kid14_haiku',      // old version

    // Day 9 - has 16, need 9. Remove 7
    'day_9_kid14_torii_count',  // dup of day_9_kid14_torii
    'day_9_kid9_kinkaku_mirror',// dup photo kid9
    'day_9_kid14_heart',        // old version
    'day_9_kid9_inari_kitsune', // dup photo kid9
    'day_9_kid9_zorro',         // dup of day_9_kid9_zorros
    'day_9_kid14_phoenix',      // old version
    'day_9_kid14_balance',      // dup of day_9_kid14_ave (same title!)

    // Day 10 - has 10, need 9. Remove 1
    'day_10_kid14_nishiki',     // old version, dup of day_10_kid14_tako

    // Day 11 - has 13, need 9. Remove 4 (tag:undefined + dups)
    'day_11_kid9_onsen',     // tag:undefined, dup of day_11_onsen
    'day_11_kid14_kaiseki',  // tag:undefined, dup of day_11_kaiseki
    'day_11_fam_yukata',     // tag:undefined, dup of day_11_geta
    'day_11_kid9_tea',       // dup of day_11_tea

    // Day 12 - has 13, need 9. Remove 4
    'day_12_kid9_cedro',     // tag:undefined, dup of day_12_sugidama
    'day_12_kid14_madera',   // tag:undefined, dup of day_12_carving
    'day_12_fam_patrulla',   // tag:undefined, dup of day_12_patrol
    'day_12_kid9_silence',   // dup of day_12_silence

    // Day 13 - has 12, need 9. Remove 3
    'day_13_fam_chureito',   // tag:undefined, dup of day_13_stairs
    'day_13_kid14_gigante',  // tag:undefined, dup of day_13_perspective
    'day_13_fam_asfalto',    // tag:undefined, dup of day_13_tunnels

    // Day 14 - has 14, need 9. Remove 5
    'day_14_kid9_aliento',   // tag:undefined, dup of day_14_rock
    'day_14_kid14_presion',  // tag:undefined, dup of day_14_pressure
    'day_14_fam_oxigeno',    // tag:undefined, dup of day_14_oxygen
    'day_23_kid14_tetris',   // WRONG DAY! day_23 tetris in day_14 list
    'day_14_kid14_radar',    // dup of day_14_radar

    // Day 15 - has 12, need 9. Remove 3
    'day_15_kid9_shiraito',  // tag:undefined, dup of day_15_waterfall
    'day_15_kid14_brujula',  // tag:undefined, wrong content
    'day_15_kid9_yokai',     // dup from day 13 yokai

    // Day 16 - has 13, need 9. Remove 4
    'day_16_kid9_gato',      // tag:undefined, dup of day_16_cat
    'day_16_kid14_vortice',  // tag:undefined, dup of day_16_vortex
    'day_16_fam_shinjuku',   // tag:undefined, dup of day_16_shinjuku
    'day_16_kid14_combat',   // dup of day_16_combat

    // Day 17 - has 14, need 9. Remove 5
    'day_17_kid9_omikuji',   // tag:undefined, dup of day_17_omikuji
    'day_17_kid14_gamer',    // tag:undefined, dup of day_17_retro
    'day_17_fam_cervicales', // tag:undefined, dup of day_17_skytree
    'day_17_kid14_p2p_gen',  // dup of day_17_p2p_sender
    'day_17_kid9_p2p_recv',  // dup of day_17_p2p_receiver

    // Day 18 - has 12, need 9. Remove 3
    'day_18_kid9_marea',     // tag:undefined, dup of day_18_shibuya
    'day_18_kid14_tendencias',// tag:undefined, dup of day_18_trend
    'day_18_kid14_radio',    // dup of day_18_radio

    // Day 19 - has 12, need 9. Remove 3
    'day_19_kid9_mechas',    // tag:undefined, dup of day_19_gundam
    'day_19_kid14_luz',      // tag:undefined, dup of day_19_color
    'day_19_kid14_crypto',   // dup of day_19_crypto

    // Day 20 - has 12, need 9. Remove 3
    'day_20_kid9_bento',     // tag:undefined, dup of day_20_bento
    'day_20_kid14_ameyoko',  // tag:undefined, dup of day_20_change
    'day_20_kid9_potion',    // dup of day_20_potion

    // Day 21 - has 13, need 9. Remove 4
    'day_21_kid9_monos',     // tag:undefined, dup of day_21_monkeys
    'day_21_kid14_imperial', // tag:undefined, dup of day_21_buddha
    'day_21_kid9_dragon',    // dup of day_21_dragon
    'day_21_kid9_samurai',   // dup of day_21_slash
];

console.log(`Removing ${toRemove.length} duplicate missions...`);
let removed = 0;

// Process in REVERSE order to not mess up line numbers
const removals = [];
for (const key of toRemove) {
    const start = lines.findIndex(l => l.includes(`"${key}"`));
    if (start === -1) { console.log('  NOT FOUND: ' + key); continue; }
    let end = start, depth = 0;
    for (let i = start; i < lines.length; i++) {
        depth += (lines[i].match(/{/g)||[]).length - (lines[i].match(/}/g)||[]).length;
        if (depth <= 0 && i > start) { end = i; break; }
    }
    // Include trailing blank line if exists
    if (end + 1 < lines.length && lines[end + 1].trim() === '') end++;
    removals.push({ key, start, end });
}

// Sort by start line DESCENDING so we remove from bottom to top
removals.sort((a, b) => b.start - a.start);
for (const r of removals) {
    lines.splice(r.start, r.end - r.start + 1);
    removed++;
    console.log(`  Removed ${r.key} (lines ${r.start+1}-${r.end+1})`);
}

fs.writeFileSync('missions.js', lines.join('\n'), 'utf8');
console.log(`\nDone! Removed ${removed}/${toRemove.length} missions.`);
