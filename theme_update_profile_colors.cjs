const fs = require('fs');
const path = require('path');

const profileFile = path.join(__dirname, 'src/features/auth/Profile.tsx');

const replacements = [
  // Indigo -> Primary
  { search: /from-indigo-50\/50/g, replace: 'from-primary/5' },
  { search: /focus:border-indigo-500/g, replace: 'focus:border-primary' },
  { search: /focus:ring-indigo-500\/10/g, replace: 'focus:ring-primary/20' },
  { search: /shadow-indigo-500\/20/g, replace: 'shadow-primary/20' },
  { search: /bg-indigo-600/g, replace: 'bg-primary' },
  { search: /hover:bg-indigo-700/g, replace: 'hover:bg-primary-hover' },
  { search: /text-indigo-600/g, replace: 'text-primary' },
  
  // Red -> Danger
  { search: /from-red-50\/50/g, replace: 'from-danger/5' },
  { search: /focus:border-red-500/g, replace: 'focus:border-danger' },
  { search: /focus:ring-red-500\/10/g, replace: 'focus:ring-danger/20' },
  { search: /bg-red-100/g, replace: 'bg-danger/10' },
  { search: /text-red-600/g, replace: 'text-danger' },
];

if (fs.existsSync(profileFile)) {
  let content = fs.readFileSync(profileFile, 'utf8');
  let original = content;
  
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  
  if (content !== original) {
    fs.writeFileSync(profileFile, content, 'utf8');
    console.log(`Updated Profile.tsx`);
  }
}
