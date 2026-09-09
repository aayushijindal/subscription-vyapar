const fs = require('fs');
let content = fs.readFileSync('src/features/purchase/Purchases.tsx', 'utf8');

content = content.replace(/PurchasesPage/g, 'PurchaseReturnsPage');
content = content.replace(/purchases/g, 'purchaseReturns');
content = content.replace(/setPurchases/g, 'setPurchaseReturns');
content = content.replace(/purchaseApi\.getPurchases/g, 'purchaseApi.getPurchaseReturns');
content = content.replace(/purchaseApi\.getPurchase/g, 'purchaseApi.getPurchaseReturn');
content = content.replace(/purchaseApi\.createPurchase/g, 'purchaseApi.createPurchaseReturn');
content = content.replace(/purchaseApi\.updatePurchase/g, 'purchaseApi.updatePurchaseReturn');
content = content.replace(/purchaseApi\.deletePurchase/g, 'purchaseApi.deletePurchaseReturn');
content = content.replace(/purchase/g, 'purchaseReturn');
content = content.replace(/Purchase/g, 'PurchaseReturn');
content = content.replace(/PURCHASE/g, 'PURCHASE RETURN');

// Fix over-replacements
content = content.replace(/PurchaseReturnReturnsPage/g, 'PurchaseReturnsPage');
content = content.replace(/purchaseReturnReturns/g, 'purchaseReturns');
content = content.replace(/setPurchaseReturnReturns/g, 'setPurchaseReturns');
content = content.replace(/purchaseReturnApi/g, 'purchaseApi');
content = content.replace(/PurchaseReturnNo/g, 'PurchaseReturn No'); // For UI texts
content = content.replace(/PURCHASE RETURN ENTRY LIST/g, 'PURCHASE RETURN LIST');
content = content.replace(/PurchaseReturn Invoices/g, 'Purchase Returns');

// Remove GRN ENTRY header
content = content.replace(/<th className="py-4 px-4 text-center">GRN ENTRY<\/th>/g, '');
// Remove GRN ENTRY cell
content = content.replace(/<td className="py-4 px-4 text-center">\s*<button className="bg-slate-100 text-\[#1E293B\] border border-slate-200 px-3 py-1\.5 rounded text-\[10px\] uppercase font-black hover:bg-slate-200 transition-colors shadow-sm">GRN<\/button>\s*<\/td>/g, '');

fs.writeFileSync('src/features/purchase/PurchaseReturns.tsx', content);
console.log('Done!');
