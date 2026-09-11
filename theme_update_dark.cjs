const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Typography
  { search: /\btext-slate-900\b/g, replace: 'text-text-primary' },
  { search: /\btext-slate-800\b/g, replace: 'text-text-primary' },
  { search: /\btext-gray-900\b/g, replace: 'text-text-primary' },
  { search: /\btext-gray-800\b/g, replace: 'text-text-primary' },
  { search: /\btext-dark\b/g, replace: 'text-text-primary' }, // from previous phase
  { search: /\btext-slate-600\b/g, replace: 'text-text-secondary' },
  { search: /\btext-slate-500\b/g, replace: 'text-text-secondary' },
  { search: /\btext-gray-600\b/g, replace: 'text-text-secondary' },
  { search: /\btext-gray-500\b/g, replace: 'text-text-secondary' },
  { search: /\btext-slate-400\b/g, replace: 'text-text-muted' },
  { search: /\btext-gray-400\b/g, replace: 'text-text-muted' },
  
  // Backgrounds & Surfaces
  { search: /\bbg-white\b/g, replace: 'bg-surface' },
  { search: /\bbg-slate-50\b/g, replace: 'bg-background' },
  { search: /\bbg-slate-100\b/g, replace: 'bg-surface-soft' },
  { search: /\bbg-gray-50\b/g, replace: 'bg-background' },
  { search: /\bbg-gray-100\b/g, replace: 'bg-surface-soft' },
  { search: /\bbg-slate-900\b/g, replace: 'bg-dark' },
  { search: /\bbg-slate-800\b/g, replace: 'bg-dark' },
  
  // Borders
  { search: /\bborder-slate-100\b/g, replace: 'border-border' },
  { search: /\bborder-slate-200\b/g, replace: 'border-border' },
  { search: /\bborder-slate-300\b/g, replace: 'border-border' },
  { search: /\bborder-gray-100\b/g, replace: 'border-border' },
  { search: /\bborder-gray-200\b/g, replace: 'border-border' },
  
  // Hover & Focus States
  { search: /\bhover:bg-slate-50\b/g, replace: 'hover:bg-surface-soft' },
  { search: /\bhover:bg-slate-100\b/g, replace: 'hover:bg-surface-soft' },
  { search: /\bhover:text-slate-900\b/g, replace: 'hover:text-text-primary' },
  { search: /\bhover:text-slate-600\b/g, replace: 'hover:text-text-primary' },
  
  // Specific Form Inputs
  { search: /\bbg-surface-soft\b/g, replace: 'bg-input' }, // Forms previously used soft for inputs
  { search: /\bfocus:ring-slate-\d+\b/g, replace: 'focus:ring-primary/20' },
  
  // Other remnants
  { search: /divide-slate-100/g, replace: 'divide-border' },
  { search: /divide-slate-200/g, replace: 'divide-border' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { search, replace } of replacements) {
        content = content.replace(search, replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

console.log('Starting dark theme mapping update...');
processDirectory(srcDir);
console.log('Update complete!');
