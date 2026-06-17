const fs = require('fs');
const file = 'd:/Tirtanexa/tirtanexa_app_frontend/src/app/(learn)/belajar/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/#ffffff/gi, 'var(--surface)');
content = content.replace(/#f1f5f9/gi, 'var(--bg-alt)');
content = content.replace(/#334155/gi, 'var(--text)');
content = content.replace(/#94a3b8/gi, 'var(--text-muted)');
content = content.replace(/#475569/gi, 'var(--text-secondary)');
content = content.replace(/#0f172a/gi, 'var(--text)');
content = content.replace(/#e2e8f0/gi, 'var(--border)');
content = content.replace(/backgroundColor:\s*'white'/g, "backgroundColor: 'var(--surface)'");
content = content.replace(/backgroundColor:\s*"white"/g, 'backgroundColor: "var(--surface)"');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed inline styles in belajar page');
