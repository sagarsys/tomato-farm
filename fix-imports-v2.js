const fs = require('fs');
const path = require('path');

function updateFileImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Feature-specific import updates
  const featureDir = filePath.split('/features/')[1]?.split('/')[0];
  
  // Common patterns to fix across all files
  const patterns = [
    // Data imports
    { from: /from ["']\.\.\/data\/types["']/g, to: 'from "../../types"' },
    { from: /from ["']\.\.\/\.\.\/data\/types["']/g, to: 'from "../../../types"' },
    { from: /from ["']\.\.\/data\/mockData["']/g, to: 'from "../../services/mockData"' },
    { from: /from ["']\.\.\/\.\.\/data\/mockData["']/g, to: 'from "../../../services/mockData"' },
    
    // Utils imports
    { from: /from ["']\.\.\/utils\/orderCalculations["']/g, to: 'from "../orders/utils/orderCalculations"' },
    { from: /from ["']\.\.\/\.\.\/utils\/orderCalculations["']/g, to: 'from "../../orders/utils/orderCalculations"' },
    { from: /from ["']\.\.\/utils\/csvExport["']/g, to: 'from "../../lib/csvExport"' },
    { from: /from ["']\.\.\/\.\.\/utils\/csvExport["']/g, to: 'from "../../../lib/csvExport"' },
    
    // Hook imports
    { from: /from ["']\.\.\/hooks\/useOrdersData["']/g, to: 'from "../orders/hooks/useOrdersData"' },
    { from: /from ["']\.\.\/\.\.\/hooks\/useOrdersData["']/g, to: 'from "../../orders/hooks/useOrdersData"' },
    { from: /from ["']\.\.\/hooks\/useFarmMetrics["']/g, to: 'from "../farms/hooks/useFarmMetrics"' },
    { from: /from ["']\.\.\/\.\.\/hooks\/useFarmMetrics["']/g, to: 'from "../../farms/hooks/useFarmMetrics"' },
    
    // Component imports
    { from: /from ["']\.\.\/components\/EmptyState["']/g, to: 'from "../../components/EmptyState"' },
    { from: /from ["']\.\.\/\.\.\/components\/EmptyState["']/g, to: 'from "../../../components/EmptyState"' },
    { from: /from ["']\.\.\/common\/Loader["']/g, to: 'from "../../components/Loader"' },
    { from: /from ["']\.\.\/\.\.\/common\/Loader["']/g, to: 'from "../../../components/Loader"' },
    
    // Config imports
    { from: /from ["']\.\.\/constants\/toastConfig["']/g, to: 'from "../config/toast.config"' },
    { from: /from ["']\.\.\/config\/toast\.config["']/g, to: 'from "../../config/toast.config"' },
  ];
  
  patterns.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ ${filePath.replace(process.cwd() + '/', '')}`);
    return true;
  }
  return false;
}

// Find all TS files
function findFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        findFiles(fullPath, files);
      }
    } else if (file.match(/\.tsx?$/)) {
      files.push(fullPath);
    }
  });
  return files;
}

const srcDir = path.join(__dirname, 'src');
const files = findFiles(srcDir);
let updated = 0;

console.log('Fixing remaining imports...\n');
files.forEach(file => {
  if (updateFileImports(file)) updated++;
});

console.log(`\n✓ Fixed ${updated} files`);

