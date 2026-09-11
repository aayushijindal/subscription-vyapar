const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/features/super-admin');

const replacements = [
  // Focus & Inputs
  { search: /focus:border-\[#8B83E5\]/g, replace: 'focus:border-primary' },
  { search: /focus:ring-\[#8B83E5\]\/20/g, replace: 'focus:ring-primary/20' },
  
  // Table Rows & Hovers
  { search: /hover:bg-\[#FAFAFD\]/g, replace: 'hover:bg-input' },
  { search: /hover:bg-\[#E8EAF1\]/g, replace: 'hover:bg-input' },
  { search: /hover:bg-\[#F5F6FA\]/g, replace: 'hover:bg-input' },
  { search: /bg-\[#F5F6FA\]/g, replace: 'bg-surface-soft' },
  { search: /bg-\[#F5F7FC\]/g, replace: 'bg-surface-soft' },
  
  // Primary/Blue Variations
  { search: /bg-\[#EEF4FF\]/g, replace: 'bg-primary/10' },
  { search: /text-\[#5B8DEF\]/g, replace: 'text-primary' },
  { search: /border-\[#5B8DEF\]\/10/g, replace: 'border-primary/20' },
  { search: /border-l-\[#6C63D9\]/g, replace: 'border-l-primary' },
  { search: /border-\[#6C63D9\]\/20/g, replace: 'border-primary/20' },
  
  // Text Colors
  { search: /text-\[#4D5568\]/g, replace: 'text-text-secondary' },
  { search: /text-\[#596176\]/g, replace: 'text-text-secondary' },
  
  // Warning/Yellow Variations
  { search: /bg-\[#FFF6E6\]/g, replace: 'bg-warning-bg' },
  { search: /text-\[#D99A3D\]/g, replace: 'text-warning' },
  { search: /text-\[#B57C26\]/g, replace: 'text-warning' },
  { search: /border-\[#F5E6C9\]/g, replace: 'border-warning/20' },
  
  // Success Variations
  { search: /text-\[#42A77A\]/g, replace: 'text-success' },
  { search: /border-\[#C2E5D6\]/g, replace: 'border-success/20' },
  
  // Danger Variations
  { search: /border-\[#F9D6D8\]/g, replace: 'border-danger/20' },
  
  // Borders
  { search: /border-\[#E5E8F0\]/g, replace: 'border-border' },
  
  // SVG Colors
  { search: /stopColor="#6C63D9"/g, replace: 'stopColor="#FF6B21"' },
  { search: /stroke="#6C63D9"/g, replace: 'stroke="#FF6B21"' },
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
