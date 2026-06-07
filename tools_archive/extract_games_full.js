const fs = require('fs');
const content = fs.readFileSync('missions.js', 'utf8');

const lines = content.split('\n');
let insideGame = false;
let gameContent = '';
let bracketCount = 0;

lines.forEach(line => {
    if (line.includes('tag: "game"')) {
        insideGame = true;
        gameContent += line + '\n';
        bracketCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    } else if (insideGame) {
        gameContent += line + '\n';
        bracketCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
        if (bracketCount <= 0) {
            insideGame = false;
            gameContent += '\n------------------\n';
        }
    }
});

fs.writeFileSync('C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\4a43334d-a4b3-4706-9591-95c37e625072\\scratch\\game_missions_extracted.txt', gameContent);
