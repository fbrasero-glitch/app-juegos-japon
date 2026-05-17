const fs = require('fs');
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Add Google Fonts
indexHtml = indexHtml.replace('</head>', `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
</head>`);

// Add bottom nav before scripts
indexHtml = indexHtml.replace('    <script>', `
    <!-- NAVEGACIÓN INFERIOR (BOTTOM NAV) -->
    <nav id="bottom-nav" class="bottom-nav hidden">
        <button id="nav-btn-home" class="nav-item">
            <span class="nav-icon">🏠</span>
            <span class="nav-label">Inicio</span>
        </button>
        <button id="nav-btn-missions" class="nav-item">
            <span class="nav-icon">📜</span>
            <span class="nav-label">Misiones</span>
        </button>
        <button id="nav-btn-passport" class="nav-item">
            <span class="nav-icon">🏆</span>
            <span class="nav-label">Pasaporte</span>
        </button>
    </nav>

    <script>`);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('index.html modified');
