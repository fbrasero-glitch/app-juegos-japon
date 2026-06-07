import re

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

if '.tag-physical' not in css:
    tag_css = '.tag-physical { background: rgba(255, 87, 34, 0.2); color: #ff5722; }\n'
    css = css.replace('.tag-economy {', tag_css + '.tag-economy {')
    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(css)

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('economy: "💰"', 'economy: "💰", physical: "🏃"')

PHYSICAL_MISSIONS = {
    "day_3_kid9_foso": """{
        tag: "physical", day: 3, title: "Pasos de Gigante", role: "kid9", xp: 15, location: "Fosos del Castillo de Osaka",
        render: () => `
            <p class="mission-desc">El foso de este castillo es inmenso para proteger al Shogun. Camina por el borde y cuenta cuántos pasos de gigante necesitas para cruzar el puente principal.</p>
            <input type="number" id="p-pasos" placeholder="Número de pasos..." style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => { document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_3_kid9_foso', {type:'number', data:document.getElementById('p-pasos').value})); }
    }""",
    "day_3_kid14_asalto": """{
        tag: "physical", day: 3, title: "El Asalto al Shogun", role: "kid14", xp: 20, location: "Castillo de Osaka",
        render: () => `
            <p class="mission-desc">Debes llegar a las puertas del castillo antes de que den la alarma. Inicia la marcha rápida y detén el cronómetro cuando llegues a la entrada principal.</p>
            <div id="chrono" style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-accent); margin:15px 0;">00:00</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <button id="c-start" class="btn-secondary">Iniciar Marcha</button>
                <button id="c-stop" class="btn-secondary">Parar</button>
            </div>
            <input type="text" id="p-word" placeholder="Palabra de Samurái..." style="width:100%; margin-top:15px;">
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            let s=0; let int=null;
            document.getElementById('c-start').addEventListener('click', () => { 
                if(int) return;
                int = setInterval(() => { s++; let m=Math.floor(s/60); let sec=s%60; document.getElementById('chrono').innerText = `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; }, 1000);
            });
            document.getElementById('c-stop').addEventListener('click', () => { clearInterval(int); document.getElementById('btn-sub').classList.remove('hidden'); });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_3_kid14_asalto', {type:'text', data: `Tiempo: ${document.getElementById('chrono').innerText} | Palabra: ${document.getElementById('p-word').value}`}));
        }
    }""",
    "day_4_kid9_cangrejo": """{
        tag: "physical", day: 4, title: "El Paso del Cangrejo", role: "kid9", xp: 15, location: "Puente Sorihashi (Sumiyoshi)",
        render: () => `
            <p class="mission-desc">Este puente es tan curvo que parece una montaña. ¡Súbelo con cuidado! Cuéntale al Juez cómo has logrado vencer la gravedad.</p>
            <div class="choice-grid">
                <button class="btn-secondary c-btn" data-v="Cangrejo">🦀 Subí de lado</button>
                <button class="btn-secondary c-btn" data-v="Frente">🚶 Subí de frente</button>
            </div>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar Elección</button>
        `,
        attachEvents: () => {
            let val='';
            document.querySelectorAll('.c-btn').forEach(b => b.addEventListener('click', function() { 
                document.querySelectorAll('.c-btn').forEach(x => x.classList.remove('selected'));
                this.classList.add('selected'); val = this.dataset.v; document.getElementById('btn-sub').classList.remove('hidden');
            }));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_4_kid9_cangrejo', {type:'text', data:val}));
        }
    }""",
    "day_4_kid14_kuromon": """{
        tag: "physical", day: 4, title: "El Rastreador de Kuromon", role: "kid14", xp: 15, location: "Mercado Kuromon Ichiba",
        render: () => `
            <p class="mission-desc">Camina ágil (¡SIN CORRER!) por el mercado. Debes contar cuántos puestos de comida exótica (Carne de Kobe o Cangrejo vivo) logras detectar en tu camino.</p>
            <input type="number" id="n-puestos" placeholder="Número de puestos..." style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => { document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_4_kid14_kuromon', {type:'number', data:document.getElementById('n-puestos').value})); }
    }""",
    "day_5_kid9_galax": """{
        tag: "physical", day: 5, title: "La Galaxia de los Ciervos", role: "kid9", xp: 20, location: "Parque de Nara",
        render: () => `
            <p class="mission-desc">¡Hay ciervos por todas partes! Tienes 5 minutos para contar todos los que veas a tu alrededor. Usa los botones para llevar la cuenta.</p>
            <div style="display:flex; align-items:center; justify-content:center; gap:20px; margin:20px 0;">
                <button id="cnt-min" class="btn-secondary" style="font-size:2rem; width:60px;">-</button>
                <div id="cnt-val" style="font-size:3rem; font-weight:bold;">0</div>
                <button id="cnt-plus" class="btn-secondary" style="font-size:2rem; width:60px;">+</button>
            </div>
            <button id="btn-calc" class="btn-secondary" style="width:100%">Calcular total en media hora</button>
            <p id="res-calc" class="hidden" style="text-align:center; margin-top:10px; font-weight:bold; color:var(--color-accent);"></p>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            let c=0;
            const update = () => document.getElementById('cnt-val').innerText = c;
            document.getElementById('cnt-plus').addEventListener('click', () => { c++; update(); });
            document.getElementById('cnt-min').addEventListener('click', () => { if(c>0) c--; update(); });
            document.getElementById('btn-calc').addEventListener('click', () => {
                const total = c * 6;
                document.getElementById('res-calc').innerText = `¡A este ritmo verás ${total} ciervos en media hora!`;
                document.getElementById('res-calc').classList.remove('hidden');
                document.getElementById('btn-sub').classList.remove('hidden');
            });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_5_kid9_galax', {type:'text', data:document.getElementById('res-calc').innerText}));
        }
    }""",
    "day_5_kid14_suerte": """{
        tag: "physical", day: 5, title: "El Guardián de la Suerte", role: "kid14", xp: 20, location: "Templo Todai-ji",
        render: () => `
            <p class="mission-desc">La arquitectura de este templo es colosal. Para entender su escala, debes medirlo con tu propio cuerpo.</p>
            <input type="number" id="i1" placeholder="¿Cuántos pilares exteriores hay?" style="width:100%; margin-bottom:10px;">
            <input type="number" id="i2" placeholder="¿Cuántas brazadas tuyas mide un pilar?" style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => { document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_5_kid14_suerte', {type:'text', data: `Pilares: ${document.getElementById('i1').value} | Brazadas: ${document.getElementById('i2').value}`})); }
    }""",
    "day_6_kid9_huida": """{
        tag: "physical", day: 6, title: "La Huida del Ninja", role: "kid9", xp: 20, location: "Jardines del Castillo Nijo",
        render: () => `
            <p class="mission-desc">¡Debes escapar del palacio sin ser visto! Elige cómo has caminado por los jardines para no hacer ruido.</p>
            <div id="q1">
                <div class="choice-grid">
                    <button class="btn-secondary n-btn" data-v="Normal">Normal</button>
                    <button class="btn-secondary n-btn" data-v="De puntillas">De puntillas</button>
                    <button class="btn-secondary n-btn" data-v="Agachado">Agachado</button>
                </div>
            </div>
            <div id="q2" class="hidden">
                <p style="margin-top:15px;"><b>¿Cuál de esas posturas te ha cansado más?</b></p>
                <div class="choice-grid">
                    <button class="btn-secondary n-btn2" data-v="Normal">Normal</button>
                    <button class="btn-secondary n-btn2" data-v="De puntillas">De puntillas</button>
                    <button class="btn-secondary n-btn2" data-v="Agachado">Agachado</button>
                </div>
            </div>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar Huida</button>
        `,
        attachEvents: () => {
            let res1=''; let res2='';
            document.querySelectorAll('.n-btn').forEach(b => b.addEventListener('click', function() {
                res1 = this.dataset.v; document.getElementById('q2').classList.remove('hidden');
            }));
            document.querySelectorAll('.n-btn2').forEach(b => b.addEventListener('click', function() {
                res2 = this.dataset.v; document.getElementById('btn-sub').classList.remove('hidden');
            }));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_6_kid9_huida', {type:'text', data: `Misión: ${res1} | Cansancio: ${res2}`}));
        }
    }""",
    "day_6_kid14_anillo": """{
        tag: "physical", day: 6, title: "El Anillo Imperial", role: "kid14", xp: 20, location: "Palacio Imperial de Kioto",
        render: () => `
            <p class="mission-desc">Mide tu velocidad imperial. Cronometra cuánto tardas en dar 100 pasos exactos por el recinto del palacio.</p>
            <div id="chrono" style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-accent); margin:15px 0;">00:00</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <button id="c-start" class="btn-secondary">Iniciar</button>
                <button id="c-stop" class="btn-secondary">Parar</button>
            </div>
            <input type="number" id="i-calc" placeholder="¿Vueltas para una Maratón (42km)?" style="width:100%; margin-top:15px;">
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar Cálculo</button>
        `,
        attachEvents: () => {
            let s=0; let int=null;
            document.getElementById('c-start').addEventListener('click', () => { 
                if(int) return;
                int = setInterval(() => { s++; let m=Math.floor(s/60); let sec=s%60; document.getElementById('chrono').innerText = `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; }, 1000);
            });
            document.getElementById('c-stop').addEventListener('click', () => { clearInterval(int); document.getElementById('btn-sub').classList.remove('hidden'); });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_6_kid14_anillo', {type:'text', data: `Tiempo 100p: ${document.getElementById('chrono').innerText} | Calc Maratón: ${document.getElementById('i-calc').value}`}));
        }
    }""",
    "day_7_kid9_pilar": """{
        tag: "physical", day: 7, title: "El Guardián de Piedra", role: "kid9", xp: 15, location: "Templo Kiyomizu-dera",
        render: () => `
            <p class="mission-desc">Los pilares de madera de este templo son legendarios. Intenta abrazar uno de los pilares gigantes (o imagina que lo haces si hay mucha gente). ¿Llegan tus manos a tocarse?</p>
            <div class="choice-grid">
                <button class="btn-secondary p-btn" data-v="Toca">Mis dedos se tocan</button>
                <button class="btn-secondary p-btn" data-v="Casi">Casi se tocan</button>
                <button class="btn-secondary p-btn" data-v="Imposible">Necesito otros 2 brazos</button>
            </div>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            let val='';
            document.querySelectorAll('.p-btn').forEach(b => b.addEventListener('click', function() {
                val = this.dataset.v; document.getElementById('btn-sub').classList.remove('hidden');
            }));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_7_kid9_pilar', {type:'text', data:val}));
        }
    }""",
    "day_7_kid14_escaleras": """{
        tag: "physical", day: 7, title: "La Conquista de las Escaleras", role: "kid14", xp: 20, location: "Subida a Kiyomizu-dera",
        render: () => `
            <p class="mission-desc">Kioto está lleno de cuestas. Cuenta cuántos escalones subes desde la base de la calle Sannenzaka hasta la entrada del templo.</p>
            <input type="number" id="n-steps" placeholder="Número de escalones..." style="width:100%">
            <p id="bonus-msg" class="hidden" style="color:var(--color-primary); font-weight:bold; margin-top:10px;">✨ ¡Has alcanzado el rango de Monje Alpino! (+5 XP extra al validar)</p>
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            const inp = document.getElementById('n-steps');
            const msg = document.getElementById('bonus-msg');
            inp.addEventListener('input', () => { if(inp.value >= 100) msg.classList.remove('hidden'); else msg.classList.add('hidden'); });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_7_kid14_escaleras', {type:'number', data:inp.value}));
        }
    }""",
    "day_8_kid9_pose": """{
        tag: "photo", day: 8, title: "El Trono de Piedra", role: "kid9", xp: 20, location: "Templo Otagi Nenbutsu-ji",
        render: () => `
            <p class="mission-desc">Hay 1200 estatuas y todas son diferentes. Busca la que tenga la pose más extraña e imítala para una foto. ¡El Juez evaluará tu parecido!</p>
            <input type="file" id="p-cam" accept="image/*" capture="environment" style="display:none">
            <button onclick="document.getElementById('p-cam').click()" class="btn-secondary" style="width:100%">📸 Foto Imitación</button>
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            document.getElementById('p-cam').addEventListener('change', () => document.getElementById('btn-sub').classList.remove('hidden'));
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_8_kid9_pose', {type:'text', data:'Foto imitación enviada'}));
        }
    }""",
    "day_8_kid14_bosque": """{
        tag: "physical", day: 8, title: "El Bosque de 2.7km", role: "kid14", xp: 20, location: "Arashiyama",
        render: () => `
            <p class="mission-desc">Debes completar el circuito sagrado. Marca los puntos de control cuando estés físicamente en ellos.</p>
            <div class="card" style="margin-bottom:15px;">
                <label><input type="checkbox" class="b-chk"> 🎍 Entrada al Bambú</label><br>
                <label><input type="checkbox" class="b-chk"> 🌊 Estanque Tenryu-ji</label><br>
                <label><input type="checkbox" class="b-chk"> 🌉 Puente Togetsukyo</label>
            </div>
            <input type="number" id="p-total" placeholder="Pasos totales (podómetro)..." style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px; opacity:0.5;" disabled>Enviar al Juez</button>
        `,
        attachEvents: () => {
            const chks = document.querySelectorAll('.b-chk');
            const btn = document.getElementById('btn-sub');
            chks.forEach(c => c.addEventListener('change', () => {
                const all = Array.from(chks).every(x => x.checked);
                btn.disabled = !all; btn.style.opacity = all ? '1' : '0.5';
            }));
            btn.addEventListener('click', () => submitMission('day_8_kid14_bosque', {type:'text', data: `Pasos: ${document.getElementById('p-total').value}`}));
        }
    }""",
    "day_9_kid9_zorros": """{
        tag: "physical", day: 9, title: "La Escalada de los Zorros", role: "kid9", xp: 25, location: "Fushimi Inari-taisha",
        render: () => `
            <p class="mission-desc">Subir la montaña lleva tiempo. Tienes 10 minutos de subida intensa. Al terminar, podrás descansar y contarle al Juez tu secreto.</p>
            <div id="countdown" style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-primary); margin:15px 0;">10:00</div>
            <button id="btn-start" class="btn-secondary" style="width:100%">Empezar subida</button>
            <div id="rest-area" class="hidden" style="margin-top:20px;">
                <p>🍵 <b>¡Hora de descansar!</b></p>
                <input type="text" id="z-text" placeholder="¿Cuál es el zorro más raro que has visto?" style="width:100%">
                <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
            </div>
        `,
        attachEvents: () => {
            let time=600; let int=null;
            document.getElementById('btn-start').addEventListener('click', () => {
                if(int) return;
                document.getElementById('btn-start').classList.add('hidden');
                int = setInterval(() => {
                    time--; let m=Math.floor(time/60); let s=time%60;
                    document.getElementById('countdown').innerText = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
                    if(time<=0) { clearInterval(int); document.getElementById('rest-area').classList.remove('hidden'); }
                }, 1000);
            });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_9_kid9_zorros', {type:'text', data:document.getElementById('z-text').value}));
        }
    }""",
    "day_9_kid14_ave": """{
        tag: "physical", day: 9, title: "La Postura del Ave Dorada", role: "kid14", xp: 20, location: "Kinkaku-ji",
        render: () => `
            <p class="mission-desc">Imita al fénix del tejado. Ponte a la pata coja mirando el templo de oro. ¿Cuánto tiempo logras aguantar el equilibrio?</p>
            <div id="chrono" style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-accent); margin:15px 0;">0s</div>
            <button id="btn-start" class="btn-secondary" style="width:100%">¡Iniciar Equilibrio!</button>
            <button id="btn-stop" class="btn-primary hidden" style="width:100%; margin-top:10px;">Perdí el equilibrio</button>
        `,
        attachEvents: () => {
            let s=0; let int=null;
            document.getElementById('btn-start').addEventListener('click', () => {
                document.getElementById('btn-start').classList.add('hidden');
                document.getElementById('btn-stop').classList.remove('hidden');
                int = setInterval(() => { s++; document.getElementById('chrono').innerText = s + 's'; }, 1000);
            });
            document.getElementById('btn-stop').addEventListener('click', () => {
                clearInterval(int);
                submitMission('day_9_kid14_ave', {type:'text', data: `Aguanté ${s} segundos`});
            });
        }
    }""",
    "day_10_kid9_dragon": """{
        tag: "physical", day: 10, title: "El Dragón del Mercado", role: "kid9", xp: 15, location: "Mercado Nishiki",
        render: () => `
            <p class="mission-desc">Busca los puestos de encurtidos (Tsukemono). Son de colores brillantes como escamas de dragón. ¿Cuántos logras encontrar?</p>
            <input type="number" id="n-tsu" placeholder="Número de puestos..." style="width:100%">
            <button id="btn-sub" class="btn-primary" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => { document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_10_kid9_dragon', {type:'number', data:document.getElementById('n-tsu').value})); }
    }""",
    "day_10_kid14_milla": """{
        tag: "physical", day: 10, title: "La Milla del Samurái", role: "kid14", xp: 20, location: "Ribera del Río Kamo",
        render: () => `
            <p class="mission-desc">La ribera del río Kamo es perfecta para una marcha rápida. Cronometra cuánto tardas en recorrer un tramo y anota algo curioso que veas en la orilla.</p>
            <div id="chrono" style="font-size:3rem; text-align:center; font-weight:bold; color:var(--color-accent); margin:15px 0;">00:00</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <button id="btn-start" class="btn-secondary">Empezar</button>
                <button id="btn-stop" class="btn-secondary">Parar</button>
            </div>
            <input type="text" id="p-curios" placeholder="Lo más curioso fue..." style="width:100%; margin-top:15px;">
            <button id="btn-sub" class="btn-primary hidden" style="width:100%; margin-top:15px;">Enviar al Juez</button>
        `,
        attachEvents: () => {
            let s=0; let int=null;
            document.getElementById('btn-start').addEventListener('click', () => {
                if(int) return;
                int = setInterval(() => { s++; let m=Math.floor(s/60); let sec=s%60; document.getElementById('chrono').innerText = `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; }, 1000);
            });
            document.getElementById('btn-stop').addEventListener('click', () => { clearInterval(int); document.getElementById('btn-sub').classList.remove('hidden'); });
            document.getElementById('btn-sub').addEventListener('click', () => submitMission('day_10_kid14_milla', {type:'text', data: `Tiempo: ${document.getElementById('chrono').innerText} | Curiosidad: ${document.getElementById('p-curios').value}`}));
        }
    }"""
}

for mId, mCode in PHYSICAL_MISSIONS.items():
    if '"' + mId + '":' in content:
        pattern = '"' + mId + '": \\{.*?\\}\\n    \\}(?=[,\\n])'
        content = re.sub(pattern, '"' + mId + '": ' + mCode, content, flags=re.DOTALL)
    else:
        insertion_point = content.find('};', content.find('const MISSIONS_CONFIG = {'))
        content = content[:insertion_point] + '    "' + mId + '": ' + mCode + ',\n' + content[insertion_point:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Misiones Físicas integradas.")
