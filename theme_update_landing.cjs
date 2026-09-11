const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Backgrounds & Surfaces
  { search: /bg-\[#fafcff\]/g, replace: 'bg-background' },
  { search: /from-\[#eaf2f9\]/g, replace: 'from-surface-soft' },
  { search: /bg-\[#eaf2f9\]/g, replace: 'bg-surface-soft' },
  { search: /bg-\[#132f50\]/g, replace: 'bg-surface' }, // Premium card bg
  { search: /shadow-\[#132f50\]\/30/g, replace: 'shadow-premium' },
  { search: /bg-\[#376fa9\]/g, replace: 'bg-primary' },

  // Typography
  { search: /text-\[#132f50\]/g, replace: 'text-text-primary' },
  { search: /text-\[#376fa9\]/g, replace: 'text-primary' },
  { search: /text-\[#688099\]/g, replace: 'text-text-secondary' },
  { search: /text-\[#1c3a59\]/g, replace: 'text-text-primary' },
  { search: /text-\[#71859b\]/g, replace: 'text-text-secondary' },
  { search: /text-\[#3c5976\]/g, replace: 'text-text-secondary' },
  { search: /text-\[#366b9f\]/g, replace: 'text-primary' },
  { search: /text-\[#9ab0c6\]/g, replace: 'text-text-muted' },

  // Borders & Dividers
  { search: /border-\[#e3ebf2\]/g, replace: 'border-border' },
  { search: /shadow-slate-200\/20/g, replace: 'shadow-none' },

  // Specific overrides for Premium button
  { search: /!text-\[#132f50\]/g, replace: 'text-text-primary' },
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

console.log('Starting custom hex landing page update...');
processDirectory(srcDir);
console.log('Update complete!');
