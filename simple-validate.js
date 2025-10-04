const fs = require('fs');
const path = require('path');

// Simple validation script to check for basic syntax issues
function validateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const errors = [];
    
    // Check for basic template literal issues
    const bracketMatches = content.match(/\${[^}]*}/g) || [];
    const openBrackets = (content.match(/\${/g) || []).length;
    const closeBrackets = (content.match(/}/g) || []).length;
    
    // Check for obviously malformed template literals
    if (content.includes('Classes[size]') || content.includes('Classes[') || content.includes(']Classes')) {
      errors.push('Malformed template literal with "Classes" variable');
    }
    
    // Check for improper switch cases
    if (content.includes('[encodeSizeMode(')) {
      errors.push('Invalid switch case syntax with [encodeSizeMode(');
    }
    
    // Check for missing lib variable
    if (content.includes('${lib}') && !content.includes('const lib =') && !content.includes('const lib=')) {
      errors.push('Missing lib variable declaration');
    }
    
    // Check for mismatched brackets in template literals
    const templateLiterals = content.match(/`[^`]*`/g) || [];
    templateLiterals.forEach((literal, index) => {
      const openCount = (literal.match(/\${/g) || []).length;
      const closeCount = (literal.match(/}/g) || []).length;
      if (openCount !== closeCount) {
        errors.push(`Template literal ${index + 1} has mismatched brackets`);
      }
    });
    
    return errors;
  } catch (error) {
    return [`Failed to read file: ${error.message}`];
  }
}

function validateComponents() {
  const componentsDir = path.join(__dirname, 'packages/components/src');
  let totalFiles = 0;
  let filesWithErrors = 0;
  let totalErrors = 0;
  
  function scanDirectory(dir) {
    const entries = fs.readdirSync(dir);
    
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.endsWith('.tsx') || entry.endsWith('.ts')) {
        totalFiles++;
        const errors = validateFile(fullPath);
        if (errors.length > 0) {
          filesWithErrors++;
          totalErrors += errors.length;
          console.log(`❌ ${path.relative(componentsDir, fullPath)}:`);
          errors.forEach(error => console.log(`   - ${error}`));
        } else {
          console.log(`✅ ${path.relative(componentsDir, fullPath)}`);
        }
      }
    });
  }
  
  console.log('🔍 Validating AnuKit Components...\n');
  scanDirectory(componentsDir);
  
  console.log('\n📊 Validation Summary:');
  console.log(`Total files: ${totalFiles}`);
  console.log(`Files with errors: ${filesWithErrors}`);
  console.log(`Files clean: ${totalFiles - filesWithErrors}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Success rate: ${Math.round(((totalFiles - filesWithErrors) / totalFiles) * 100)}%`);
  
  return filesWithErrors === 0;
}

// Run validation
const success = validateComponents();
process.exit(success ? 0 : 1);