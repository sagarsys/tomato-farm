const fs = require('fs');
const path = require('path');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Determine which feature this file belongs to
  const featureMatch = filePath.match(/features\/([^\/]+)/);
  const feature = featureMatch ? featureMatch[1] : null;
  
  // Common replacements
  const replacements = [
    // Types imports
    { from: /from ["']\.\.\/data\/types["']/g, to: 'from "@/types"' },
    { from: /from ["']\.\.\/\.\.\/data\/types["']/g, to: 'from "@/types"' },
    { from: /from ["']\.\.\/\.\.\/\.\.\/types["']/g, to: 'from "@/types"' },
    
    // Services imports
    { from: /from ["']\.\.\/data\/mockData["']/g, to: 'from "@/services/mockData"' },
    { from: /from ["']\.\.\/\.\.\/data\/mockData["']/g, to: 'from "@/services/mockData"' },
    { from: /from ["']\.\.\/\.\.\/\.\.\/services\/mockData["']/g, to: 'from "@/services/mockData"' },
    
    // Lib imports
    { from: /from ["']\.\.\/utils\/csvExport["']/g, to: 'from "@/lib/csvExport"' },
    { from: /from ["']\.\.\/\.\.\/utils\/csvExport["']/g, to: 'from "@/lib/csvExport"' },
    { from: /from ["']\.\.\/\.\.\/\.\.\/lib\/csvExport["']/g, to: 'from "@/lib/csvExport"' },
    
    // Component imports
    { from: /from ["']\.\.\/components\/EmptyState["']/g, to: 'from "@/components/EmptyState"' },
    { from: /from ["']\.\.\/\.\.\/components\/EmptyState["']/g, to: 'from "@/components/EmptyState"' },
    { from: /from ["']\.\.\/\.\.\/\.\.\/components\/EmptyState["']/g, to: 'from "@/components/EmptyState"' },
    
    // Loader imports
    { from: /from ["']\.\.\/common\/Loader["']/g, to: 'from "@/components/Loader"' },
    { from: /from ["']\.\.\/\.\.\/common\/Loader["']/g, to: 'from "@/components/Loader"' },
    { from: /from ["']\.\.\/\.\.\/\.\.\/components\/Loader["']/g, to: 'from "@/components/Loader"' },
    
    // Config imports
    { from: /from ["']\.\.\/constants\/toastConfig["']/g, to: 'from "@/config/toast.config"' },
    { from: /from ["']\.\.\/config\/toast\.config["']/g, to: 'from "@/config/toast.config"' },
    
    // Format helpers (extract from orderCalculations)
    { from: /(formatCurrency|formatVolume),?/g, to: '' }, // Will be replaced separately
  ];
  
  // Feature-specific patterns
  if (feature === 'dashboard') {
    replacements.push(
      { from: /from ["']\.\.\/utils\/orderCalculations["']/g, to: 'from "@/features/orders/utils/orderCalculations"' },
      { from: /from ["']\.\.\/hooks\/useOrdersData["']/g, to: 'from "@/features/orders/hooks/useOrdersData"' }
    );
  }
  
  if (feature === 'farms') {
    replacements.push(
      { from: /from ["']\.\.\/hooks\/useOrdersData["']/g, to: 'from "@/features/orders/hooks/useOrdersData"' },
      { from: /from ["']\.\.\/utils\/orderCalculations["']/g, to: 'from "@/features/orders/utils/orderCalculations"' }
    );
  }
  
  if (feature === 'supply-chain') {
    replacements.push(
      { from: /from ["']\.\.\/hooks\/useOrdersData["']/g, to: 'from "@/features/orders/hooks/useOrdersData"' },
      { from: /from ["']\.\.\/utils\/orderCalculations["']/g, to: 'from "@/features/orders/utils/orderCalculations"' }
    );
  }
  
  // Apply replacements
  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });
  
  // Fix formatCurrency and formatVolume imports
  // If file imports orderCalculations, check if it uses format functions
  if (content.includes('orderCalculations') && (content.includes('formatCurrency') || content.includes('formatVolume'))) {
    // Add format import if not already there
    if (!content.includes('from "@/lib/format"')) {
      // Find the orderCalculations import line
      const orderCalcImportMatch = content.match(/import {([^}]+)} from ["']@\/features\/orders\/utils\/orderCalculations["'];/);
      if (orderCalcImportMatch) {
        const imports = orderCalcImportMatch[1].split(',').map(s => s.trim()).filter(s => !s.includes('format'));
        const cleanImports = imports.filter(i => i && i !== '');
        
        if (cleanImports.length > 0) {
          content = content.replace(
            orderCalcImportMatch[0],
            `import { ${cleanImports.join(', ')} } from "@/features/orders/utils/orderCalculations";\nimport { formatCurrency, formatVolume } from "@/lib/format";`
          );
        } else {
          content = content.replace(
            orderCalcImportMatch[0],
            `import { formatCurrency, formatVolume } from "@/lib/format";`
          );
        }
      }
    }
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ ${path.relative(process.cwd(), filePath)}`);
    return true;
  }
  return false;
}

// Find all TS/TSX files
function findFiles(dir, files = []) {
  const entries = fs.readdirSync(dir);
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
      findFiles(fullPath, files);
    } else if (entry.match(/\.tsx?$/)) {
      files.push(fullPath);
    }
  });
  return files;
}

const srcDir = path.join(__dirname, 'src');
const files = findFiles(srcDir);
let count = 0;

console.log('Updating imports...\n');
files.forEach(file => {
  if (updateFile(file)) count++;
});

console.log(`\n✓ Updated ${count} files`);

