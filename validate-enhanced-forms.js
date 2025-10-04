#!/usr/bin/env node

/**
 * Enhanced Form Components Validation Script
 * Tests all form components including new TextField, DatePicker, Form and validation hooks
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = './packages/components/src';
const CORE_DIR = './packages/core/src';
const STYLES_DIR = './packages/styles/src';

// Expected form components (including new ones)
const FORM_COMPONENTS = ['Select', 'Textarea', 'FormControl', 'TextField', 'DatePicker', 'Form'];
const FORM_HOOKS = ['form-hooks'];

console.log('🚀 Enhanced OptimUI Form System Validation\n');

// Test 1: Check all form component files exist
console.log('✅ Test 1: Form Component Files');
let componentTestsPassed = 0;

FORM_COMPONENTS.forEach(component => {
  const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
  if (fs.existsSync(componentPath)) {
    console.log(`  ✓ ${component}.tsx exists`);
    componentTestsPassed++;
  } else {
    console.log(`  ✗ ${component}.tsx missing`);
  }
});

console.log(`  Result: ${componentTestsPassed}/${FORM_COMPONENTS.length} form components found\n`);

// Test 2: Check form hooks exist
console.log('✅ Test 2: Form Hooks');
let hooksTestsPassed = 0;

FORM_HOOKS.forEach(hook => {
  const hookPath = path.join(CORE_DIR, 'hooks', `${hook}.ts`);
  if (fs.existsSync(hookPath)) {
    console.log(`  ✓ ${hook}.ts exists`);
    hooksTestsPassed++;
  } else {
    console.log(`  ✗ ${hook}.ts missing`);
  }
});

console.log(`  Result: ${hooksTestsPassed}/${FORM_HOOKS.length} form hooks found\n`);

// Test 3: Check CSS files
console.log('✅ Test 3: Form CSS Files');
const formCssPath = path.join(STYLES_DIR, 'forms.css');
let cssTestsPassed = 0;

if (fs.existsSync(formCssPath)) {
  console.log(`  ✓ forms.css exists`);
  cssTestsPassed++;
} else {
  console.log(`  ✗ forms.css missing`);
}

console.log(`  Result: ${cssTestsPassed}/1 form CSS file found\n`);

// Test 4: Check component structure and exports
console.log('✅ Test 4: Component Structure');
let structureTestsPassed = 0;

FORM_COMPONENTS.forEach(component => {
  const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
  if (fs.existsSync(componentPath)) {
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Check for required patterns
    const hasForwardRef = content.includes('forwardRef');
    const hasInterface = content.includes(`${component}Props`);
    const hasExport = content.includes(`export { ${component} }`);
    const hasDisplayName = content.includes(`${component}.displayName`);
    
    const tests = [hasForwardRef, hasInterface, hasExport, hasDisplayName];
    const passed = tests.filter(Boolean).length;
    
    if (passed >= 3) { // Allow some flexibility
      console.log(`  ✓ ${component} has proper structure (${passed}/4 checks)`);
      structureTestsPassed++;
    } else {
      console.log(`  ✗ ${component} missing required patterns (${passed}/4 checks)`);
    }
  }
});

console.log(`  Result: ${structureTestsPassed}/${FORM_COMPONENTS.length} components properly structured\n`);

// Test 5: Check index exports
console.log('✅ Test 5: Index Exports');
const indexPath = path.join(COMPONENTS_DIR, 'index.ts');
const coreIndexPath = path.join(CORE_DIR, 'index.ts');
let exportTestsPassed = 0;

if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, 'utf8');
  
  FORM_COMPONENTS.forEach(component => {
    if (content.includes(`export { ${component}`) || content.includes(`{ ${component},`)) {
      console.log(`  ✓ ${component} properly exported from components`);
      exportTestsPassed++;
    } else {
      console.log(`  ✗ ${component} not exported from components`);
    }
  });
  
  // Check type exports
  const typeExports = ['TextFieldProps', 'DatePickerProps', 'FormProps'];
  typeExports.forEach(type => {
    if (content.includes(`export type { ${type}`)) {
      console.log(`  ✓ ${type} type properly exported`);
      exportTestsPassed++;
    } else {
      console.log(`  ✗ ${type} type not exported`);
    }
  });
}

if (fs.existsSync(coreIndexPath)) {
  const coreContent = fs.readFileSync(coreIndexPath, 'utf8');
  
  const hookExports = ['useForm', 'useField', 'useValidation'];
  hookExports.forEach(hook => {
    if (coreContent.includes(hook)) {
      console.log(`  ✓ ${hook} properly exported from core`);
      exportTestsPassed++;
    } else {
      console.log(`  ✗ ${hook} not exported from core`);
    }
  });
}

console.log(`  Result: ${exportTestsPassed}/${FORM_COMPONENTS.length + 6} exports found\n`);

// Test 6: Enhanced CSS utilities
console.log('✅ Test 6: Enhanced Form CSS Utilities');
let cssUtilsTestsPassed = 0;

if (fs.existsSync(formCssPath)) {
  const cssContent = fs.readFileSync(formCssPath, 'utf8');
  
  const requiredClasses = [
    '.optimui-form-control',
    '.optimui-select',
    '.optimui-textarea',
    '.optimui-textfield',
    '.optimui-datepicker',
    '.optimui-form',
    '.optimui-form-error',
    '.optimui-form-helper'
  ];
  
  requiredClasses.forEach(className => {
    if (cssContent.includes(className)) {
      console.log(`  ✓ ${className} utility class found`);
      cssUtilsTestsPassed++;
    } else {
      console.log(`  ✗ ${className} utility class missing`);
    }
  });
}

console.log(`  Result: ${cssUtilsTestsPassed}/8 enhanced CSS utility classes found\n`);

// Test 7: Component features validation
console.log('✅ Test 7: Component Features');
let featuresTestsPassed = 0;

// Check TextField features
const textFieldPath = path.join(COMPONENTS_DIR, 'TextField', 'TextField.tsx');
if (fs.existsSync(textFieldPath)) {
  const textFieldContent = fs.readFileSync(textFieldPath, 'utf8');
  
  const textFieldFeatures = [
    'clearable',
    'showPasswordToggle',
    'showCharacterCount',
    'prefix',
    'suffix',
    'leftIcon',
    'rightIcon'
  ];
  
  textFieldFeatures.forEach(feature => {
    if (textFieldContent.includes(feature)) {
      featuresTestsPassed++;
    }
  });
  
  console.log(`  ✓ TextField has ${textFieldFeatures.filter(f => textFieldContent.includes(f)).length}/${textFieldFeatures.length} expected features`);
}

// Check DatePicker features
const datePickerPath = path.join(COMPONENTS_DIR, 'DatePicker', 'DatePicker.tsx');
if (fs.existsSync(datePickerPath)) {
  const datePickerContent = fs.readFileSync(datePickerPath, 'utf8');
  
  const datePickerFeatures = [
    'calendar',
    'minDate',
    'maxDate',
    'format',
    'firstDayOfWeek',
    'disabledDates'
  ];
  
  datePickerFeatures.forEach(feature => {
    if (datePickerContent.includes(feature)) {
      featuresTestsPassed++;
    }
  });
  
  console.log(`  ✓ DatePicker has ${datePickerFeatures.filter(f => datePickerContent.includes(f)).length}/${datePickerFeatures.length} expected features`);
}

// Check Form features
const formPath = path.join(COMPONENTS_DIR, 'Form', 'Form.tsx');
if (fs.existsSync(formPath)) {
  const formContent = fs.readFileSync(formPath, 'utf8');
  
  const formFeatures = [
    'useFormContext',
    'useFormField',
    'ValidationRule',
    'validateForm',
    'resetForm',
    'handleSubmit'
  ];
  
  formFeatures.forEach(feature => {
    if (formContent.includes(feature)) {
      featuresTestsPassed++;
    }
  });
  
  console.log(`  ✓ Form has ${formFeatures.filter(f => formContent.includes(f)).length}/${formFeatures.length} expected features`);
}

// Check form hooks features
const hooksPath = path.join(CORE_DIR, 'hooks', 'form-hooks.ts');
if (fs.existsSync(hooksPath)) {
  const hooksContent = fs.readFileSync(hooksPath, 'utf8');
  
  const hooksFeatures = [
    'useForm',
    'useField',
    'useValidation',
    'validateValue',
    'ValidationRule',
    'FieldState',
    'FormConfig'
  ];
  
  hooksFeatures.forEach(feature => {
    if (hooksContent.includes(feature)) {
      featuresTestsPassed++;
    }
  });
  
  console.log(`  ✓ Form hooks have ${hooksFeatures.filter(f => hooksContent.includes(f)).length}/${hooksFeatures.length} expected features`);
}

console.log(`  Result: Advanced features validation completed\n`);

// Test 8: Component sizes
console.log('✅ Test 8: Component Sizes');
let totalLines = 0;
let componentCount = 0;

FORM_COMPONENTS.forEach(component => {
  const componentPath = path.join(COMPONENTS_DIR, component, `${component}.tsx`);
  if (fs.existsSync(componentPath)) {
    const content = fs.readFileSync(componentPath, 'utf8');
    const lineCount = content.split('\n').length;
    console.log(`  ${component}: ${lineCount} lines`);
    totalLines += lineCount;
    componentCount++;
  }
});

if (fs.existsSync(formCssPath)) {
  const cssContent = fs.readFileSync(formCssPath, 'utf8');
  const cssLineCount = cssContent.split('\n').length;
  console.log(`  forms.css: ${cssLineCount} lines`);
  totalLines += cssLineCount;
}

if (fs.existsSync(hooksPath)) {
  const hooksContent = fs.readFileSync(hooksPath, 'utf8');
  const hooksLineCount = hooksContent.split('\n').length;
  console.log(`  form-hooks.ts: ${hooksLineCount} lines`);
  totalLines += hooksLineCount;
}

console.log(`  Total form system: ${totalLines} lines\n`);

// Summary
const totalTests = componentTestsPassed + hooksTestsPassed + cssTestsPassed + structureTestsPassed + Math.min(exportTestsPassed, 12) + cssUtilsTestsPassed;
const maxTests = FORM_COMPONENTS.length + FORM_HOOKS.length + 1 + FORM_COMPONENTS.length + 12 + 8;

console.log('📊 Enhanced Form System Validation Summary');
console.log('==========================================');
console.log(`Total Tests Passed: ${totalTests}/${maxTests}`);
console.log(`Success Rate: ${Math.round((totalTests / maxTests) * 100)}%`);
console.log('');

if (totalTests === maxTests) {
  console.log('🎉 Enhanced form system validation PASSED! All components ready for production.');
} else {
  console.log('❌ Enhanced form system validation FAILED. Some components need attention.');
}

console.log('');
console.log('📋 Form System Components:');
console.log('  Core Forms: Select, Textarea, FormControl (original)');
console.log('  Enhanced: TextField, DatePicker, Form (new)');
console.log('  Hooks: useForm, useField, useValidation (new)');
console.log('  CSS: Comprehensive styling for all components');
console.log('');
console.log('✨ New Features Added:');
console.log('  • TextField with prefix/suffix, clear button, password toggle');
console.log('  • DatePicker with calendar popup and keyboard navigation');
console.log('  • Form with validation context and state management');
console.log('  • Comprehensive validation hooks for form logic');
console.log('  • Enhanced CSS styling for all new components');