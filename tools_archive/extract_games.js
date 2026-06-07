const fs = require('fs');
const content = fs.readFileSync('missions.js', 'utf8');

// Simple regex to just find titles of games
const lines = content.split('\n');
lines.forEach(line => {
    if (line.includes('tag: "game"')) {
        const titleMatch = line.match(/title:\s*"([^"]+)"/);
        const idMatch = line.match(/"([^"]+)":/);
        if (titleMatch && idMatch) {
            console.log(`- ${idMatch[1]}: ${titleMatch[1]}`);
        }
    }
});
