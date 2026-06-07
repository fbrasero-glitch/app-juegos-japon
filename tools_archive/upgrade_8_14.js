const fs = require('fs');
let lines = fs.readFileSync('missions.js', 'utf8').split('\n');
function replaceMission(key, newCode) {
    const start = lines.findIndex(l => l.includes(`"${key}"`));
    if (start === -1) { console.log('NOT FOUND: ' + key); return; }
    let end = start, depth = 0;
    for (let i = start; i < lines.length; i++) {
        depth += (lines[i].match(/{/g)||[]).length - (lines[i].match(/}/g)||[]).length;
        if (depth <= 0 && i > start) { end = i; break; }
    }
    lines.splice(start, end - start + 1, ...newCode.split('\n'));
    console.log(`OK ${key}`);
}

// day_9_kid14_gravity (100 chars - PROTOTYPE)
replaceMission('day_9_kid14_gravity', `    "day_9_kid14_gravity": {
        tag: "versus", day: 9, title: "Piedra Gravedad", role: "kid14", xp: 15, location: "Kinkaku-ji",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> TEST DE GRAVEDAD TERRESTRE</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Encuentra una piedra del jardín zen. Déjala caer desde la altura de tu cintura y cronometra cuánto tarda en tocar el suelo. La gravedad de Japón es la misma... ¿o no?</p>
            <div style="text-align:center; margin:15px 0; background:#0a0a1a; padding:20px; border-radius:12px;">
                <div id="gv-icon" style="font-size:3rem; transition:transform 0.5s;">🪨</div>
                <div id="gv-timer" style="font-size:2.5rem; color:#60efff; font-family:monospace; margin:10px 0;">0.00s</div>
            </div>
            <button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px;">🫳 Soltar Piedra</button>
            <button id="btn-end" class="btn-primary hidden" style="width:100%;">💥 ¡Impacto!</button>
        </div>\`,
        attachEvents: () => {
            let t0=0,int=null;
            document.getElementById('btn-start').addEventListener('click',(e)=>{
                t0=Date.now(); e.target.classList.add('hidden'); document.getElementById('btn-end').classList.remove('hidden');
                document.getElementById('gv-icon').style.transform='translateY(60px)';
                int=setInterval(()=>document.getElementById('gv-timer').innerText=((Date.now()-t0)/1000).toFixed(2)+'s',10);
            });
            document.getElementById('btn-end').addEventListener('click',()=>{clearInterval(int); submitMission('day_9_kid14_gravity',{type:'text',data:'Caída: '+document.getElementById('gv-timer').innerText});});
            window._missionCleanup=()=>clearInterval(int);
        }
    },`);

// day_9_kid14_angulo (128 chars - PROTOTYPE)
replaceMission('day_9_kid14_angulo', `    "day_9_kid14_angulo": {
        tag: "photo", day: 9, title: "Ángulo Imposible", role: "kid14", xp: 15, location: "Fushimi Inari",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> MISIÓN FOTOGRÁFICA TÁCTICA</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Captura el túnel de toriis rojos desde un ángulo que nadie más haría: desde el suelo mirando hacia arriba, tumbado, en contrapicado extremo...</p>
            <div style="text-align:center; margin:15px 0; background:#0a0a1a; padding:20px; border-radius:12px;">
                <p style="font-size:3rem;">⛩️📐</p>
                <p style="color:#ff6b35; font-style:italic;">El ángulo más creativo gana</p>
            </div>
            <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Ángulo Imposible</button>
        </div>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_9_kid14_angulo', currentUser, false); }
    },`);

// day_9_kid14_tunnel (199 chars)
replaceMission('day_9_kid14_tunnel', `    "day_9_kid14_tunnel": {
        tag: "photo", day: 9, title: "El Túnel Infinito", role: "kid14", xp: 15, location: "Fushimi Inari",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> CAPTURA DE PERSPECTIVA INFINITA</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Miles de toriis forman un túnel que parece no terminar nunca. Captura la foto que mejor transmita esa sensación de infinito.</p>
            <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(180deg,#ff4500,#ff6b35,#ff8c00); border-radius:12px;">
                <p style="font-size:3rem;">⛩️⛩️⛩️</p>
                <p style="color:#fff; font-weight:bold;">El túnel que no termina</p>
            </div>
            <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Fotografiar el Infinito</button>
        </div>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_9_kid14_tunnel', currentUser, false); }
    },`);

// day_9_kid9_altar (204 chars)
replaceMission('day_9_kid9_altar', `    "day_9_kid9_altar": {
        tag: "photo", day: 9, title: "El Altar Secreto", role: "kid9", xp: 15, location: "Fushimi Inari",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🔮 En la montaña de Fushimi Inari hay altares escondidos entre los árboles que casi nadie ve. Tu misión de exploradora: encontrar uno secreto y fotografiarlo antes de que desaparezca.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#2d1b69,#5b2c6f); border-radius:15px;">
            <p style="font-size:3rem;">🔮⛩️✨</p>
            <p style="color:#d8b4fe; font-style:italic;">Solo los verdaderos exploradores lo encuentran</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Altar Secreto</button>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_9_kid9_altar', currentUser, false); }
    },`);

// day_10_kid9_nishiki (52 chars!! - WORST)
replaceMission('day_10_kid9_nishiki', `    "day_10_kid9_nishiki": {
        tag: "economy", day: 10, title: "Maestro Chatarra", role: "kid9", xp: 15, location: "Nishiki",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🛍️ El mercado de Nishiki tiene cientos de puestos con cosas raras y maravillosas. Tu misión: encontrar el objeto más extraño que se venda y averiguar su precio.</p>
        <div style="background:linear-gradient(135deg,#f7c948,#ff6b35); border-radius:15px; padding:20px; margin:15px 0; text-align:center;">
            <p style="font-size:3rem;">🐙🍡🎎</p>
            <p style="color:#fff; font-weight:bold;">¿Qué es lo más raro que puedes encontrar?</p>
        </div>
        <input type="text" id="ni-item" placeholder="Objeto encontrado..." style="width:100%; margin-bottom:8px; padding:12px; border-radius:8px; border:2px solid #f7c948; font-size:1rem;">
        <input type="number" id="ni-price" placeholder="Precio en ¥..." style="width:100%; margin-bottom:15px; padding:12px; border-radius:8px; border:2px solid #f7c948; font-size:1rem;">
        <button id="btn" class="btn-primary" style="width:100%; font-size:1.1rem; padding:15px;">📨 Enviar Hallazgo</button>\`,
        attachEvents: () => { document.getElementById('btn').addEventListener('click', () => {
            const item=document.getElementById('ni-item').value, price=document.getElementById('ni-price').value;
            if(!item||!price){showAlert('Incompleto','Indica qué encontraste y su precio.');return;}
            submitMission('day_10_kid9_nishiki',{type:'text',data:'Objeto: '+item+', Precio: '+price+'¥'});
        }); }
    },`);

// day_10_fam_sayonara (80 chars!! - VERY BAD)
replaceMission('day_10_fam_sayonara', `    "day_10_fam_sayonara": {
        tag: "writing", day: 10, title: "Sayonara Kioto", role: "both", xp: 20, location: "Kioto",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🌸 Misión Familiar: Kioto ha sido mágico. Antes de partir, cada miembro de la familia escribe una cosa que nunca olvidará de esta ciudad.</p>
        <div style="text-align:center; margin:15px 0; padding:25px; background:linear-gradient(135deg,#ffecd2,#fcb69f); border-radius:15px; border:2px solid #d4af37;">
            <p style="font-size:3rem;">🌸⛩️🦌</p>
            <p style="color:#8B4513; font-weight:bold; margin-top:10px;">Sayonara, Kioto</p>
        </div>
        <textarea id="say-ans" placeholder="Lo que nunca olvidaré de Kioto..." style="width:100%; height:100px; margin-bottom:15px; padding:12px; border-radius:10px; border:2px solid #d4af37; font-size:1rem;"></textarea>
        <button id="btn" class="btn-primary" style="width:100%; font-size:1.1rem; padding:15px; background:linear-gradient(135deg,#d4af37,#f7c948); color:#000;">🌸 Sellar Recuerdo</button>\`,
        attachEvents: (role) => { document.getElementById('btn').addEventListener('click', () => {
            const val=document.getElementById('say-ans').value;
            if(val.length<10){showAlert('Espera','Escribe al menos una frase completa.');return;}
            submitMission('day_10_fam_sayonara',{type:'text',data:val},role,true);
        }); }
    },`);

// day_11_tatami (138 chars)
replaceMission('day_11_tatami', `    "day_11_tatami": {
        tag: "photo", day: 11, title: "La Textura del Tatami", role: "kid9", xp: 15, location: "Ryokan",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🟫 El tatami huele a hierba fresca y tiene una textura única. Acerca la cámara al máximo y captura los detalles que nadie más ve: las fibras, los bordados, las sombras...</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#8B7355,#D2B48C); border-radius:15px;">
            <p style="font-size:3rem;">🔍🟫✨</p>
            <p style="color:#fff; font-style:italic;">Macro-fotografía de explorador</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Foto Macro del Tatami</button>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_11_tatami', currentUser, false); }
    },`);

// day_12_sugidama (167 chars)
replaceMission('day_12_sugidama', `    "day_12_sugidama": {
        tag: "photo", day: 12, title: "La Bola de Cedro", role: "kid9", xp: 15, location: "Takayama",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🟤 Las sugidama son bolas gigantes de ramas de cedro que cuelgan en las puertas de las fábricas de sake. Cuando están verdes el sake es nuevo; cuando marrones, está listo. ¡Encuentra una y descubre su estado!</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#2d5a27,#8B4513); border-radius:15px;">
            <p style="font-size:3rem;">🟤🌿🍶</p>
            <p style="color:#90EE90; font-weight:bold;">¿Verde (nueva) o marrón (lista)?</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Sugidama</button>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_12_sugidama', currentUser, false); }
    },`);

// day_13_manhole (144 chars)
replaceMission('day_13_manhole', `    "day_13_manhole": {
        tag: "photo", day: 13, title: "El Sello del Lago", role: "kid9", xp: 15, location: "Kawaguchiko",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🎨 En Japón, las tapas de alcantarilla son obras de arte. Cada ciudad tiene su propio diseño único. Busca la más bonita cerca del lago y captúrala.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#1a1a2e,#4a148c); border-radius:15px;">
            <p style="font-size:3rem;">🎨🔵⭕</p>
            <p style="color:#ce93d8; font-style:italic;">Arte bajo tus pies</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Tapa Artística</button>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_13_manhole', currentUser, false); }
    },`);

// day_13_perspective (162 chars)
replaceMission('day_13_perspective', `    "day_13_perspective": {
        tag: "photo", day: 13, title: "Perspectiva del Gigante", role: "kid14", xp: 15, location: "Monte Fuji",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> CAPTURA DE ESCALA HUMANA</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Fotografía el Monte Fuji con una persona en primer plano para demostrar su escala descomunal. La diferencia de tamaño debe ser impactante.</p>
            <div style="text-align:center; margin:15px 0; background:#0a0a1a; padding:20px; border-radius:12px;">
                <p style="font-size:3rem;">🗻🧍‍♂️</p>
                <p style="color:#60efff;">Humano vs. Montaña</p>
            </div>
            <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Perspectiva</button>
        </div>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_13_perspective', currentUser, false); }
    },`);

// day_14_rock (172 chars)
replaceMission('day_14_rock', `    "day_14_rock": {
        tag: "photo", day: 14, title: "Aliento de Volcán", role: "kid9", xp: 15, location: "Hakone",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🌋 Las rocas volcánicas de Hakone huelen a azufre y tienen colores extraños: amarillo, naranja, gris... Encuentra la roca más rara y fotografíala de cerca. ¡Cuidado, huele fatal!</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#8B0000,#ff6b35,#f7c948); border-radius:15px;">
            <p style="font-size:3rem;">🌋🪨💨</p>
            <p style="color:#fff; font-weight:bold;">¡Huele a huevo podrido!</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Roca Volcánica</button>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_14_rock', currentUser, false); }
    },`);

// day_14_root (148 chars)
replaceMission('day_14_root', `    "day_14_root": {
        tag: "photo", day: 14, title: "Guardián del Bosque", role: "kid9", xp: 15, location: "Hakone",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🌳 En el bosque de Hakone, las raíces de los árboles gigantes salen de la tierra como tentáculos. Encuentra el árbol con las raíces más impresionantes y posa junto a él como su guardiana.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#1a472a,#2d5a27); border-radius:15px;">
            <p style="font-size:3rem;">🌳🧝‍♀️✨</p>
            <p style="color:#90EE90; font-style:italic;">El bosque tiene guardianes secretos</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Foto con el Árbol Guardián</button>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_14_root', currentUser, false); }
    },`);

fs.writeFileSync('missions.js', lines.join('\n'), 'utf8');
console.log('Upgrade 8-14 done!');
