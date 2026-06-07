import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Definición de las nuevas misiones complejas (CORREGIDO)
NEW_COMPLEX_MISSIONS = {
    "day_6_fam_decreto": """{
        day: 6, tag: "versus", title: "El Duelo del Decreto", role: "both", xp: 25, location: "Palacio Imperial",
        render: () => `
            <div id="versus-container">
                <p class="mission-desc">Redactad decretos absurdos sin que el otro mire.</p>
                <div id="phase-1">
                    <div class="card" style="border: 1px dashed var(--color-accent)">
                        <p>👤 <b>Turno de Niña (9):</b></p>
                        <input type="password" id="d-kid9" placeholder="Escribe tu decreto..." style="width:100%">
                    </div>
                    <div class="card" style="border: 1px dashed var(--color-primary)">
                        <p>👤 <b>Turno de Niño (14):</b></p>
                        <input type="password" id="d-kid14" placeholder="Escribe tu decreto..." style="width:100%">
                    </div>
                    <button id="btn-reveal" class="btn-primary" style="width:100%; margin-top:15px;">Revelar Decretos</button>
                </div>
                <div id="phase-2" class="hidden">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div class="card"><p><b>Niña dice:</b></p><p id="rev-kid9"></p></div>
                        <div class="card"><p><b>Niño dice:</b></p><p id="rev-kid14"></p></div>
                    </div>
                    <p style="text-align:center; margin:15px 0;">⚔️ <b>Votación Familiar</b></p>
                    <div class="choice-grid">
                        <button class="btn-secondary v-btn" data-win="kid9">9 es más ridículo</button>
                        <button class="btn-secondary v-btn" data-win="kid14">14 es más ridículo</button>
                    </div>
                    <button id="btn-submit-v" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
                </div>
            </div>
        `,
        attachEvents: () => {
            const btnR = document.getElementById('btn-reveal');
            btnR.addEventListener('click', () => {
                const d9 = document.getElementById('d-kid9').value;
                const d14 = document.getElementById('d-kid14').value;
                if(!d9 || !d14) return;
                document.getElementById('rev-kid9').innerText = d9;
                document.getElementById('rev-kid14').innerText = d14;
                document.getElementById('phase-1').classList.add('hidden');
                document.getElementById('phase-2').classList.remove('hidden');
            });
            document.querySelectorAll('.v-btn').forEach(b => b.addEventListener('click', () => document.getElementById('btn-submit-v').classList.remove('hidden')));
            document.getElementById('btn-submit-v').addEventListener('click', () => submitMission('day_6_fam_decreto', {type:'text', data:'Duelo completado'}, 'both', true));
        }
    }""",
    "day_6_kid9_ruisenor_video": """{
        day: 6, tag: "video", title: "El Espía del Suelo Cantante", role: "kid9", xp: 20, location: "Castillo de Nijo",
        render: () => `
            <p class="mission-desc">Graba 10s de vídeo del suelo y descríbelo.</p>
            <input type="file" id="v-file" accept="video/*" capture="environment">
            <input type="text" id="v-desc" placeholder="Me recuerda a..." style="width:100%; margin-top:10px;">
            <button id="btn-v" class="btn-primary" style="width:100%; margin-top:10px;">Enviar</button>
        `,
        attachEvents: () => {
            document.getElementById('btn-v').addEventListener('click', () => submitMission('day_6_kid9_ruisenor_video', {type:'text', data:document.getElementById('v-desc').value}));
        }
    }""",
    "day_6_kid14_foto_1600": """{
        day: 6, tag: "writing", title: "Fotógrafo de 1600", role: "kid14", xp: 20, location: "Sannenzaka",
        render: () => {
            const dep = gameState.kid14.missions['day_6_kid14_tiempo'];
            if(!dep || dep.status !== 'approved') return `<p>🔒 Primero aprueba "Viaje Tiempo".</p>`;
            return `<textarea id="h" placeholder="Pie de foto 1600..."></textarea><button id="b" class="btn-primary">Enviar</button>`;
        },
        attachEvents: () => {
            const b = document.getElementById('b');
            if(b) b.addEventListener('click', () => submitMission('day_6_kid14_foto_1600', {type:'text', data:document.getElementById('h').value}));
        }
    }""",
    "day_7_kid14_guia": """{
        day: 7, tag: "video", title: "Guía en 60s", role: "kid14", xp: 20, location: "Gion",
        render: () => `<p class="mission-desc">Improvisa una guía de Gion.</p><div id="t">60</div><input type="file" id="v" accept="video/*" capture="environment"><button id="b" class="btn-primary">Enviar</button>`,
        attachEvents: () => {
            let s=60; setInterval(()=>{if(s>0){s--; document.getElementById('t').innerText=s;}},1000);
            document.getElementById('b').addEventListener('click', () => submitMission('day_7_kid14_guia', {type:'text', data:'Guía'}));
        }
    }""",
    "day_7_fam_otowa": """{
        day: 7, tag: "versus", title: "Reto Agua Sagrada", role: "both", xp: 30, location: "Kiyomizu",
        render: () => `
            <p class="mission-desc">Elegid un don para el otro.</p>
            <select id="s9"><option value="estudios">Estudios</option><option value="amor">Amor</option><option value="salud">Salud</option></select>
            <select id="s14"><option value="estudios">Estudios</option><option value="amor">Amor</option><option value="salud">Salud</option></select>
            <button id="b" class="btn-primary">Revelar y Enviar</button>
        `,
        attachEvents: () => {
            document.getElementById('b').addEventListener('click', () => submitMission('day_7_fam_otowa', {type:'text', data:'Dones'}, 'both', true));
        }
    }""",
    "day_8_kid14_codigo": """{
        day: 8, tag: "writing", title: "El Código del Jardín", role: "kid14", xp: 20, location: "Tenryu-ji",
        render: () => `<input id="i1"><input id="i2"><input id="i3"><button id="b" class="btn-primary">Enviar</button>`,
        attachEvents: () => { document.getElementById('b').addEventListener('click', () => submitMission('day_8_kid14_codigo', {type:'text', data:'Interpretación'})); }
    }""",
    "day_8_fam_silencio": """{
        day: 8, tag: "audio", title: "Silencio Competitivo", role: "both", xp: 20, location: "Arashiyama",
        render: () => `<button id="b1">Grab A</button><button id="b2">Grab B</button><button id="b" class="btn-primary">Votar y Enviar</button>`,
        attachEvents: () => { document.getElementById('b').addEventListener('click', () => submitMission('day_8_fam_silencio', {type:'text', data:'Audio'}, 'both', true)); }
    }""",
    "day_9_kid9_zorro": """{
        day: 9, tag: "video", title: "El Zorro Infiltrado", role: "kid9", xp: 25, location: "Fushimi",
        render: () => `<input type="file" accept="video/*" capture="environment"><button id="b" class="btn-primary">Enviar</button>`,
        attachEvents: () => { document.getElementById('b').addEventListener('click', () => submitMission('day_9_kid9_zorro', {type:'text', data:'Zorro'})); }
    }""",
    "day_9_kid14_angulo": """{
        day: 9, tag: "photo", title: "Ángulo Imposible", role: "kid14", xp: 20, location: "Kinkaku",
        render: () => `<input type="file" capture="environment"><input type="range" min="1" max="10"><button id="b" class="btn-primary">Enviar</button>`,
        attachEvents: () => { document.getElementById('b').addEventListener('click', () => submitMission('day_9_kid14_angulo', {type:'text', data:'Foto'})); }
    }"""
}

for mId, mCode in NEW_COMPLEX_MISSIONS.items():
    if f'"{mId}":' in content:
        pattern = rf'"{mId}": \{{.*?\}\n    \}(?=[,\n])'
        content = re.sub(pattern, f'"{mId}": {mCode}', content, flags=re.DOTALL)
    else:
        insertion_point = content.find('};', content.find('const MISSIONS_CONFIG = {'))
        content = content[:insertion_point] + f'    "{mId}": {mCode},\n' + content[insertion_point:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Misiones integradas.")
