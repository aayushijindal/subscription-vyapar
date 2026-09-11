const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/features/super-admin');

const replacements = [
  // Backgrounds
  { search: /bg-\[#FFFFFF\]/g, replace: 'bg-surface' },
  { search: /bg-\[#F6F7FB\]/g, replace: 'bg-background' },
  { search: /bg-\[#F8F8FC\]/g, replace: 'bg-surface-soft' },
  { search: /bg-white/g, replace: 'bg-surface' },
  { search: /bg-slate-50/g, replace: 'bg-surface-soft' },
  { search: /bg-\[#F9FAFB\]/g, replace: 'bg-surface-soft' },
  
  // Text Colors
  { search: /text-\[#25283A\]/g, replace: 'text-text-primary' },
  { search: /text-\[#687085\]/g, replace: 'text-text-secondary' },
  { search: /text-\[#9299AA\]/g, replace: 'text-text-muted' },
  { search: /text-\[#697386\]/g, replace: 'text-text-secondary' },
  { search: /text-\[#8A91A0\]/g, replace: 'text-text-muted' },
  
  // Primary (Indigo -> Orange)
  { search: /text-\[#6C63D9\]/g, replace: 'text-primary' },
  { search: /bg-\[#F0EEFF\]/g, replace: 'bg-primary/10' },
  { search: /bg-\[#F1EFFF\]/g, replace: 'bg-primary/10' },
  { search: /bg-\[#6C63D9\]/g, replace: 'bg-primary' },
  { search: /hover:bg-\[#5E56B7\]/g, replace: 'hover:bg-primary-hover' },
  { search: /text-\[#5E56B7\]/g, replace: 'text-primary' },
  
  // Borders
  { search: /border-\[#E8EAF1\]/g, replace: 'border-border' },
  { search: /border-\[#DFE3EC\]/g, replace: 'border-border' },
  { search: /border-\[#F2F4F7\]/g, replace: 'border-border' },
  { search: /divide-\[#E8EAF1\]/g, replace: 'divide-border' },
  
  // Hovers
  { search: /hover:bg-\[#F7F6FC\]/g, replace: 'hover:bg-surface-soft' },
  { search: /hover:bg-\[#F8F9FA\]/g, replace: 'hover:bg-surface-soft' },
  { search: /hover:bg-\[#F9FAFB\]/g, replace: 'hover:bg-surface-soft' },
  
  // Status Colors
  { search: /bg-\[#EAF7F1\]/g, replace: 'bg-success-bg' },
  { search: /text-\[#27815D\]/g, replace: 'text-success' },
  { search: /bg-\[#FCEEEF\]/g, replace: 'bg-danger-bg' },
  { search: /text-\[#D96F75\]/g, replace: 'text-danger' },
  { search: /bg-\[#FFF4E5\]/g, replace: 'bg-warning-bg' },
  { search: /text-\[#B26A00\]/g, replace: 'text-warning' },
];

if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    if (file.endsWith('.tsx')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;
      
      for (const { search, replace } of replacements) {
        content = content.replace(search, replace);
      }
      
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  }
}
