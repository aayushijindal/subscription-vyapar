const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/layout/DashboardLayout.tsx',
  'src/components/layout/SuperAdminLayout.tsx',
  'src/features/auth/Profile.tsx',
  'src/components/ui/GenericMasterPage.tsx'
];

const replacements = [
  // DashboardLayout
  { search: /bg-\[#f5f8fb\]/g, replace: 'bg-background' },
  
  // SuperAdminLayout & Generic
  { search: /bg-\[#F6F7FB\]/g, replace: 'bg-background' },
  { search: /bg-\[#FFFFFF\]/g, replace: 'bg-surface' },
  { search: /border-\[#E8EAF1\]/g, replace: 'border-border' },
  { search: /text-\[#687085\]/g, replace: 'text-text-secondary' },
  { search: /bg-\[#F0EEFF\]/g, replace: 'bg-primary/10' },
  { search: /text-\[#6C63D9\]/g, replace: 'text-primary' },
  { search: /text-\[#25283A\]/g, replace: 'text-text-primary' },
  { search: /text-\[#9299AA\]/g, replace: 'text-text-muted' },
  { search: /bg-\[#F1EFFF\]/g, replace: 'bg-primary/10' },
  { search: /text-\[#5E56B7\]/g, replace: 'text-primary' },
  { search: /hover:bg-\[#F7F6FC\]/g, replace: 'hover:bg-surface-soft' },
  { search: /text-\[#697386\]/g, replace: 'text-text-secondary' },
  { search: /bg-\[#F8F8FC\]/g, replace: 'bg-surface-soft' },
  { search: /bg-\[#EAF2FF\]/g, replace: 'bg-primary/10' },
  { search: /text-\[#5B8DEF\]/g, replace: 'text-primary' },
  { search: /text-\[#8A91A0\]/g, replace: 'text-text-muted' },
  { search: /hover:text-\[#D96F75\]/g, replace: 'hover:text-danger' },
  { search: /hover:bg-\[#FCEEEF\]/g, replace: 'hover:bg-danger/10' },
  { search: /text-\[#27815D\]/g, replace: 'text-success' },
  { search: /bg-\[#EAF7F1\]/g, replace: 'bg-success/10' },
  
  // Profile.tsx
  { search: /bg-\[#f8fafc\]/g, replace: 'bg-surface-soft' },
  { search: /bg-\[#eef7f2\]/g, replace: 'bg-success-bg' },
  { search: /text-\[#238b55\]/g, replace: 'text-success' },
  { search: /divide-\[#e3ebf2\]/g, replace: 'divide-border' },
  { search: /border-\[#f4f7fb\]/g, replace: 'border-border' },
  { search: /text-\[#48647f\]/g, replace: 'text-text-secondary' },
  { search: /bg-blue-50\/50/g, replace: 'bg-primary/5' },
  { search: /bg-red-50\/50/g, replace: 'bg-danger/5' },
  { search: /bg-indigo-50\/50/g, replace: 'bg-primary/5' },
  { search: /bg-red-100/g, replace: 'bg-danger/10' },
  { search: /bg-indigo-100/g, replace: 'bg-primary/10' },
  { search: /text-indigo-600/g, replace: 'text-primary' },
  
  // GenericMasterPage
  { search: /border-\[#eaf2f9\]/g, replace: 'border-border' },
  { search: /border-t-\[#376fa9\]/g, replace: 'border-t-primary' },
];

for (const relPath of filesToUpdate) {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;
    for (const { search, replace } of replacements) {
      content = content.replace(search, replace);
    }
    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated ${relPath}`);
    }
  } else {
    console.log(`Not found: ${relPath}`);
  }
}
