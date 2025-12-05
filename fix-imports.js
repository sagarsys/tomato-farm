const fs = require('fs');
const path = require('path');

// Find all TypeScript files
function findTSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findTSFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Update imports in a file
function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Replace @/components/ui with appropriate relative path based on file location
  if (content.includes('@/components/ui/')) {
    const relativePath = path.relative(path.dirname(filePath), path.join(__dirname, 'src/ui'));
    const normalizedPath = relativePath.split(path.sep).join('/');
    content = content.replace(/@\/components\/ui\//g, `${normalizedPath}/`);
    updated = true;
  }
  
  // Replace @/lib with appropriate relative path
  if (content.includes('@/lib/')) {
    const relativePath = path.relative(path.dirname(filePath), path.join(__dirname, 'src/lib'));
    const normalizedPath = relativePath.split(path.sep).join('/');
    content = content.replace(/@\/lib\//g, `${normalizedPath}/`);
    updated = true;
  }
  
  // Update specific old imports to new locations
  const replacements = [
    { from: /from ["']\.\.\/data\/types["']/g, to: 'from "../../../types"' },
    { from: /from ["']\.\.\/data\/mockData["']/g, to: 'from "../../../services/mockData"' },
    { from: /from ["']\.\.\/utils\/orderCalculations["']/g, to: 'from "../../orders/utils/orderCalculations"' },
    { from: /from ["']\.\.\/utils\/csvExport["']/g, to: 'from "../../../lib/csvExport"' },
    { from: /from ["']\.\.\/hooks\/useOrdersData["']/g, to: 'from "../../orders/hooks/useOrdersData"' },
    { from: /from ["']\.\.\/hooks\/useFarmMetrics["']/g, to: 'from "../../farms/hooks/useFarmMetrics"' },
    { from: /from ["']\.\.\/components\/EmptyState["']/g, to: 'from "../../../components/EmptyState"' },
    { from: /from ["']\.\.\/common\/Loader["']/g, to: 'from "../../../components/Loader"' },
    { from: /from ["']\.\.\/constants\/toastConfig["']/g, to: 'from "../config/toast.config"' },
  ];
  
  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      updated = true;
    }
  });
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const files = findTSFiles(srcDir);

console.log(`Found ${files.length} TypeScript files`);
console.log('Updating imports...\n');

files.forEach(updateImports);

console.log('\nImport updates complete!');

