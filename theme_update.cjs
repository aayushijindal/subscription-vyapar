const fs = require('fs');
const files = [
  'src/features/purchase/Purchases.tsx',
  'src/features/purchase/PurchaseReturns.tsx',
  'src/features/purchase/FinishGoods.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-\[#1E293B\]/g, 'bg-[#142b4a]');
  content = content.replace(/hover:bg-\[#0F172A\]/g, 'hover:bg-[#0f1f38]');
  content = content.replace(/text-\[#1E293B\]/g, 'text-[#12213b]');
  content = content.replace(/focus:border-\[#4338CA\]/g, 'focus:border-[#2b5f9d]');
  content = content.replace(/focus:ring-\[#4338CA\]/g, 'focus:ring-[#2b5f9d]');
  content = content.replace(/text-\[#2563EB\]/g, 'text-[#2b5f9d]');
  content = content.replace(/hover:border-\[#4338CA\]\/30/g, 'hover:border-[#2b5f9d]/30');
  content = content.replace(/hover:text-\[#4338CA\]/g, 'hover:text-[#2b5f9d]');
  fs.writeFileSync(file, content);
});
console.log('Done!');
