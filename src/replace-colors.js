const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-white': 'bg-[var(--surface)]',
  'text-slate-900': 'text-[var(--text)]',
  'text-slate-800': 'text-[var(--text)]',
  'text-slate-700': 'text-[var(--text-secondary)]',
  'text-slate-600': 'text-[var(--text-secondary)]',
  'text-slate-500': 'text-[var(--text-muted)]',
  'text-slate-400': 'text-[var(--text-muted)]',
  'border-slate-100': 'border-[var(--border)]',
  'border-slate-200': 'border-[var(--border)]',
  'border-slate-300': 'border-[var(--border-hover)]',
  'bg-slate-50': 'bg-[var(--bg-alt)]',
  'bg-slate-100': 'bg-[var(--bg-alt)]',
  'hover:bg-slate-50': 'hover:bg-[var(--surface-hover)]',
  'hover:bg-slate-100': 'hover:bg-[var(--surface-hover)]',
  'hover:border-slate-300': 'hover:border-[var(--border-hover)]'
};

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const dirsToProcess = [
  'd:/Tirtanexa/tirtanexa_app_frontend/src/app',
  'd:/Tirtanexa/tirtanexa_app_frontend/src/components'
];

dirsToProcess.forEach(dir => {
  const files = walkDir(dir);
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
    for (const [key, value] of Object.entries(replacements)) {
      // Split by boundary.
      const regex = new RegExp('(?<=[\\\\s\\"\\\'\\`])' + key + '(?=[\\\\s\\"\\\'\\`])', 'g');
      content = content.replace(regex, value);
    }
    
    // Additional direct replacements for border colors, since some might be e.g. border-slate-200/50
    content = content.replace(/border-slate-200\/50/g, 'border-[var(--border)]\/50');
    content = content.replace(/bg-slate-50\/60/g, 'bg-[var(--bg-alt)]\/60');
    content = content.replace(/bg-white\/20/g, 'bg-[var(--surface)]\/20');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated: ' + file);
    }
  });
});
console.log('Done replacement script!');
