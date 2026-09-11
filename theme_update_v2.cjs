const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Previous Hex Replacements
  { search: /bg-\[#142b4a\]/g, replace: 'bg-primary' },
  { search: /hover:bg-\[#0f1f38\]/g, replace: 'hover:bg-primary-hover' },
  { search: /text-\[#12213b\]/g, replace: 'text-dark' },
  { search: /text-\[#526b88\]/g, replace: 'text-text-secondary' },
  { search: /text-\[#2b5f9d\]/g, replace: 'text-primary' },
  { search: /bg-\[#F8F9FC\]/g, replace: 'bg-background' },
  { search: /focus:border-\[#2b5f9d\]/g, replace: 'focus:border-primary' },
  { search: /border-\[#2b5f9d\]\/30/g, replace: 'border-primary/30' },
  { search: /hover:border-\[#2b5f9d\]\/30/g, replace: 'hover:border-primary/30' },
  { search: /hover:text-\[#2b5f9d\]/g, replace: 'hover:text-primary' },
  { search: /border-\[#2b5f9d\]/g, replace: 'border-primary' },
  
  // Slate generic replacements
  { search: /bg-slate-50\b/g, replace: 'bg-surface-soft' },
  { search: /bg-slate-100\b/g, replace: 'bg-background' },
  { search: /border-slate-200\/60/g, replace: 'border-border/60' },
  { search: /border-slate-200/g, replace: 'border-border' },
  { search: /border-slate-100/g, replace: 'border-border/50' },
  { search: /text-slate-500/g, replace: 'text-text-secondary' },
  { search: /text-slate-400/g, replace: 'text-text-muted' },
  
  // Specific Sidebar/Layout colors
  { search: /bg-\[#12213b\]/g, replace: 'bg-dark' },
  { search: /bg-\[#0f1f38\]/g, replace: 'bg-dark-hover' },
  { search: /bg-\[#163f70\]/g, replace: 'bg-primary' },
  { search: /text-\[#8da4c0\]/g, replace: 'text-text-muted' },
  { search: /border-\[#2a3f5a\]/g, replace: 'border-border' },
  { search: /border-\[#1e314b\]/g, replace: 'border-border/60' },

  // Tailwind Default Blue Replacements
  { search: /bg-blue-600/g, replace: 'bg-primary' },
  { search: /text-blue-600/g, replace: 'text-primary' },
  { search: /border-blue-600/g, replace: 'border-primary' },
  { search: /hover:text-blue-600/g, replace: 'hover:text-primary' },
  { search: /hover:bg-blue-600/g, replace: 'hover:bg-primary-hover' },
  
  { search: /text-blue-500/g, replace: 'text-primary' },
  { search: /border-blue-500/g, replace: 'border-primary' },
  { search: /focus:border-blue-500/g, replace: 'focus:border-primary' },
  { search: /focus:ring-blue-500/g, replace: 'focus:ring-primary' },
  { search: /shadow-blue-500/g, replace: 'shadow-primary' },
  { search: /ring-blue-500/g, replace: 'ring-primary' },

  { search: /bg-blue-50/g, replace: 'bg-primary-light' },
  { search: /bg-blue-100/g, replace: 'bg-primary-light' },
  { search: /border-blue-100/g, replace: 'border-primary/20' },
  { search: /border-blue-200/g, replace: 'border-primary/30' },
  { search: /border-blue-400/g, replace: 'border-primary/50' },
  { search: /text-blue-700/g, replace: 'text-primary-hover' },
  { search: /text-blue-400/g, replace: 'text-primary/80' },
  
  // Tailwind Default Slate/Dark Replacements for Landing Page
  { search: /text-slate-900/g, replace: 'text-dark' },
  { search: /bg-slate-900/g, replace: 'bg-dark' },
  { search: /text-slate-600/g, replace: 'text-text-secondary' },
  { search: /text-slate-700/g, replace: 'text-text-secondary' }
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

console.log('Starting global theme update phase 2 (Tailwind classes)...');
processDirectory(srcDir);
console.log('Update phase 2 complete!');
