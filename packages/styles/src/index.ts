/**
 * @optimui/styles - CSS styling system
 * This package exports CSS files only
 */

// Re-export CSS file paths for bundlers
export const cssFiles = {
  index: './index.css',
  button: './button.css',
  layout: './layout.css',
  forms: './forms.css',
  dataDisplay: './data-display.css',
  feedback: './feedback.css',
  navigation: './navigation.css',
  overlay: './overlay.css',
  variables: './variables.css'
} as const;
