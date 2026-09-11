const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/features/dashboard/DashboardHome.tsx');

const replacements = [
  { search: /bg-\[#f8fafc\]/g, replace: 'bg-surface-soft' },
  { search: /bg-\[#eef7f2\]/g, replace: 'bg-success-bg' },
  { search: /text-\[#238b55\]/g, replace: 'text-success' },
  { search: /divide-\[#e3ebf2\]/g, replace: 'divide-border' },
  { search: /border-\[#f4f7fb\]/g, replace: 'border-border' },
  { search: /text-\[#48647f\]/g, replace: 'text-text-secondary' },
];

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated DashboardHome.tsx`);
  }
}
