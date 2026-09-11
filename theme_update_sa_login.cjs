const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/features/super-admin/SuperAdminLogin.tsx');

const replacements = [
  { search: /bg-\[#F6F7FB\]/g, replace: 'bg-background' },
  { search: /bg-\[#FFFFFF\]/g, replace: 'bg-surface' },
  { search: /border-\[#E8EAF1\]/g, replace: 'border-border' },
  { search: /bg-\[#F0EEFF\]/g, replace: 'bg-primary/10' },
  { search: /text-\[#6C63D9\]/g, replace: 'text-primary' },
  { search: /text-\[#25283A\]/g, replace: 'text-text-primary' },
  { search: /text-\[#687085\]/g, replace: 'text-text-secondary' },
  { search: /bg-\[#FCEEEF\]/g, replace: 'bg-danger/10' },
  { search: /text-\[#D96F75\]/g, replace: 'text-danger' },
  { search: /border-\[#F9D6D8\]/g, replace: 'border-danger/20' },
  { search: /border-\[#DFE3EC\]/g, replace: 'border-border' },
  { search: /placeholder:text-\[#9299AA\]/g, replace: 'placeholder:text-text-muted' },
  { search: /focus:border-\[#8B83E5\]/g, replace: 'focus:border-primary' },
  { search: /focus:ring-\[#8B83E5\]\/20/g, replace: 'focus:ring-primary/20' },
  { search: /text-\[#9299AA\]/g, replace: 'text-text-muted' },
  { search: /hover:text-\[#687085\]/g, replace: 'hover:text-text-primary' },
  { search: /bg-\[#6C63D9\]/g, replace: 'bg-primary' },
  { search: /hover:bg-\[#5E56B7\]/g, replace: 'hover:bg-primary-hover' },
];

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated SuperAdminLogin.tsx`);
  }
}
