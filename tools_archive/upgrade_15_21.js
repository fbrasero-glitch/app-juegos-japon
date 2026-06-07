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

// day_15_thatch (143 chars)
replaceMission('day_15_thatch', `    "day_15_thatch": {
        tag: "photo", day: 15, title: "La Aldea de Paja", role: "kid9", xp: 15, location: "Shirakawa-go",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🏠 Las casas de Shirakawa-go tienen techos de paja tan gruesos que parecen sombreros gigantes. Algunos tienen más de 60cm de grosor. ¡Fotografía el techo más impresionante!</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#8B7355,#D2B48C,#F5DEB3); border-radius:15px;">
            <p style="font-size:3rem;">🏠❄️🌾</p>
            <p style="color:#5a3e1b; font-weight:bold;">Casas que resisten 2 metros de nieve</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Techo de Paja</button>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_15_thatch', currentUser, false); }
    },`);

// day_15_shogun (154 chars)
replaceMission('day_15_shogun', `    "day_15_shogun": {
        tag: "physical", day: 15, title: "El Trono del Shogun", role: "kid9", xp: 15, location: "Takayama",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">👑 Encuentra el lugar con la mejor vista de la aldea y siéntate como si fueras la Shogun que gobierna todo lo que ve. Mantén la postura real durante 10 segundos.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#1a1a2e,#4a148c); border-radius:15px;">
            <p style="font-size:3rem;">👑🏯⚔️</p>
            <div id="sh-timer" style="font-size:2.5rem; color:#d4af37; font-family:monospace; margin:10px 0;">10</div>
        </div>
        <button id="btn-start" class="btn-secondary" style="width:100%; margin-bottom:10px; font-size:1.1rem; padding:15px;">👑 Adoptar Postura Real</button>
        <button id="btn" class="btn-primary hidden" style="width:100%; font-size:1.1rem; padding:15px;">📨 Enviar al Juez</button>\`,
        attachEvents: () => {
            let t=10,int=null;
            document.getElementById('btn-start').addEventListener('click',(e)=>{
                e.target.classList.add('hidden');
                int=setInterval(()=>{t--;document.getElementById('sh-timer').innerText=t;if(t<=0){clearInterval(int);document.getElementById('btn').classList.remove('hidden');document.getElementById('sh-timer').innerText='👑';}},1000);
            });
            document.getElementById('btn').addEventListener('click',()=>submitMission('day_15_shogun',{type:'game',data:'Postura Shogun completada'}));
            window._missionCleanup=()=>clearInterval(int);
        }
    },`);

// day_17_incense (176 chars)
replaceMission('day_17_incense', `    "day_17_incense": {
        tag: "photo", day: 17, title: "Humo de la Fortuna", role: "kid9", xp: 15, location: "Senso-ji",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">💨 En Senso-ji hay un enorme incensario del que sale humo sagrado. Los japoneses se lo echan por encima para atraer la suerte. ¡Haz lo mismo y captura el momento!</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#2c2c2c,#555,#888); border-radius:15px;">
            <p style="font-size:3rem;">🏯💨✨</p>
            <p style="color:#ddd; font-style:italic;">El humo que trae buena suerte</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar el Humo Sagrado</button>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_17_incense', currentUser, false); }
    },`);

// day_17_gashapon (155 chars)
replaceMission('day_17_gashapon', `    "day_17_gashapon": {
        tag: "photo", day: 17, title: "Gashapon Perfecto", role: "kid9", xp: 15, location: "Akihabara",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🎰 Los gashapon son máquinas de cápsulas sorpresa que están POR TODAS PARTES en Japón. Encuentra la máquina más rara o la cápsula más extraña y fotografíala.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#ff1493,#ff69b4,#ffb6c1); border-radius:15px;">
            <p style="font-size:3rem;">🎰🔮🎁</p>
            <p style="color:#fff; font-weight:bold;">¿Qué misterio esconde la cápsula?</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Gashapon</button>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_17_gashapon', currentUser, false); }
    },`);

// day_18_hachiko (147 chars)
replaceMission('day_18_hachiko', `    "day_18_hachiko": {
        tag: "photo", day: 18, title: "Guardián Hachiko", role: "kid9", xp: 15, location: "Shibuya",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🐕 Hachiko esperó a su dueño durante 9 AÑOS en esta estación. Es el perro más fiel de la historia de Japón. Hazte una foto con su estatua y demuéstrale que alguien sigue viniendo a verle.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#cd7f32,#daa520,#f7c948); border-radius:15px;">
            <p style="font-size:3rem;">🐕💛🌸</p>
            <p style="color:#5a3e1b; font-weight:bold;">9 años esperando... El perro más fiel</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Foto con Hachiko</button>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_18_hachiko', currentUser, false); }
    },`);

// day_19_liberty (154 chars)
replaceMission('day_19_liberty', `    "day_19_liberty": {
        tag: "photo", day: 19, title: "La Libertad Nipona", role: "kid9", xp: 15, location: "Odaiba",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🗽 ¡Japón tiene su propia Estatua de la Libertad en Odaiba! Es más pequeña que la de Nueva York, pero está junto al mar con el Rainbow Bridge de fondo. ¡Ilusión óptica: haz que parezca que la tocas!</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#1a1a2e,#006994,#00bcd4); border-radius:15px;">
            <p style="font-size:3rem;">🗽🌉✨</p>
            <p style="color:#80deea; font-style:italic;">La libertad brilla en la bahía de Tokio</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Foto Estatua de la Libertad</button>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_19_liberty', currentUser, false); }
    },`);

// day_20_pond (159 chars)
replaceMission('day_20_pond', `    "day_20_pond": {
        tag: "photo", day: 20, title: "El Pato del Estanque", role: "kid9", xp: 15, location: "Ueno",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🦆 El parque de Ueno tiene un enorme estanque lleno de lotos y patos. Tu misión de exploradora: fotografiar el pato más gracioso o el loto más bonito que encuentres.</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#006400,#228B22,#90EE90); border-radius:15px;">
            <p style="font-size:3rem;">🦆🪷💚</p>
            <p style="color:#fff; font-style:italic;">La naturaleza en medio de la ciudad</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Capturar Vida del Estanque</button>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_20_pond', currentUser, false); }
    },`);

// day_21_monkeys (155 chars)
replaceMission('day_21_monkeys', `    "day_21_monkeys": {
        tag: "photo", day: 21, title: "Los Tres Monos", role: "kid9", xp: 15, location: "Nikko",
        render: () => \`
        <p class="mission-desc" style="font-size:1.1rem; line-height:1.6;">🙈🙉🙊 En el templo de Nikko se esconde la talla más famosa de Japón: los tres monos sabios. Uno no ve, otro no oye, y el tercero no habla. ¡Encuéntralos e imita sus poses en la foto!</p>
        <div style="text-align:center; margin:15px 0; padding:20px; background:linear-gradient(135deg,#8B4513,#D2691E,#DEB887); border-radius:15px;">
            <p style="font-size:3rem;">🙈🙉🙊</p>
            <p style="color:#fff; font-weight:bold;">No ver, no oír, no hablar</p>
        </div>
        <button id="btn-cam" class="btn-secondary" style="width:100%; font-size:1.1rem; padding:15px;">📸 Foto Imitando a los Monos</button>\`,
        attachEvents: (role) => { attachCameraFlow('btn-cam', 'day_21_monkeys', currentUser, false); }
    },`);

// day_8_kid14_arashiyama (tag:undefined - fix tag)
replaceMission('day_8_kid14_arashiyama', `    "day_8_kid14_arashiyama": {
        tag: "writing", day: 8, title: "El Guardián del Bambú", role: "kid14", xp: 15, location: "Arashiyama",
        render: () => \`
        <div class="ui-terminal" style="padding:20px; border-radius:12px; border:1px solid #0f03;">
            <p style="color:#0f0;">>>> INFORME DE CAMPO: BOSQUE DE BAMBÚ</p>
            <p style="color:#0a0; font-size:0.85rem; margin-bottom:15px;">Estás dentro de uno de los lugares más fotografiados del planeta. Pero tú no eres turista, eres un agente. Escribe un informe táctico: ¿cómo suena el bambú? ¿Qué altura tiene? ¿Qué sensación da?</p>
            <textarea id="ar-ans" placeholder=">>> Informe de campo..." style="width:100%; height:90px; margin-bottom:15px; background:#111; color:#0f0; border:1px solid #0f03; padding:10px; border-radius:6px; font-family:monospace;"></textarea>
            <button id="btn" class="btn-primary" style="width:100%">📤 Transmitir Informe</button>
        </div>\`,
        attachEvents: () => { document.getElementById('btn').addEventListener('click', () => {
            const val=document.getElementById('ar-ans').value;
            if(val.length<20){showAlert('Incompleto','Un informe táctico necesita más detalle.');return;}
            submitMission('day_8_kid14_arashiyama',{type:'text',data:val});
        }); }
    },`);

fs.writeFileSync('missions.js', lines.join('\n'), 'utf8');
console.log('Upgrade 15-21 done!');
