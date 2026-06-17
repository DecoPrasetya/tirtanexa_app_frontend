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
  'hover:bg-white': 'hover:bg-[var(--surface)]',
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
    
    // Process tokens. We match the exact class name and ensure it's surrounded by non-word characters or hyphens.
    // Actually, simple split and replace inside class names is safer.
    // Instead of regex over the whole file, we can just replace the exact substrings if they are padded by spaces or quotes.
    
    // Let's use a simpler approach: replace every occurrence that is not part of a larger word
    for (const [key, value] of Object.entries(replacements)) {
      // Create a regex that looks for the key surrounded by word boundaries or quotes/spaces
      // Since hyphen is a word boundary in JS, \bkey\b works!
      // But wait, \bbg-white\b will match "hover:bg-white".
      // To prevent matching part of "hover:bg-white" when searching for "bg-white", we can do negative lookbehind if supported,
      // or we just replace the longest strings first!
      // Sort keys by length descending
    }
    
    const sortedKeys = Object.keys(replacements).sort((a, b) => b.length - a.length);
    
    for (const key of sortedKeys) {
      const value = replacements[key];
      // Regex: match the exact key, ensuring it's not preceded by a non-space/quote character, and not followed by a non-space/quote/slash.
      // E.g. [ ' " ` ] or space
      // Let's just use string replace in a loop for all instances.
      // Actually, a regex with lookarounds: (?<![a-zA-Z0-9-])key(?![a-zA-Z0-9-])
      const regex = new RegExp('(?<![a-zA-Z0-9-])' + key.replace(/-/g, '\\-') + '(?![a-zA-Z0-9-])', 'g');
      content = content.replace(regex, value);
    }
    
    // specific patterns
    content = content.replace(/border-slate-200\/50/g, 'border-[var(--border)]\/50');
    content = content.replace(/bg-slate-50\/60/g, 'bg-[var(--bg-alt)]\/60');
    content = content.replace(/bg-white\/20/g, 'bg-[var(--surface)]\/20');
    content = content.replace(/bg-white\/10/g, 'bg-[var(--surface)]\/10');
    content = content.replace(/bg-white\/5/g, 'bg-[var(--surface)]\/5');
    content = content.replace(/bg-white\/80/g, 'bg-[var(--surface)]\/80');
    content = content.replace(/border-white/g, 'border-[var(--surface)]');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated: ' + file);
    }
  });
});
console.log('Done replacement script 2!');
