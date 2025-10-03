// Design tokens for OptimUI theme system

// Color tokens
export const colors = {
  // Primary palette
  primary: {
    50: 'hsl(217, 91%, 95%)',
    100: 'hsl(217, 91%, 85%)',
    200: 'hsl(217, 91%, 75%)',
    300: 'hsl(217, 91%, 65%)',
    400: 'hsl(217, 91%, 55%)',
    500: 'hsl(217, 91%, 50%)', // Main primary color
    600: 'hsl(217, 91%, 45%)',
    700: 'hsl(217, 91%, 35%)',
    800: 'hsl(217, 91%, 25%)',
    900: 'hsl(217, 91%, 15%)',
  },
  
  // Semantic colors
  success: {
    50: 'hsl(120, 60%, 95%)',
    500: 'hsl(120, 60%, 50%)',
    900: 'hsl(120, 60%, 15%)',
  },
  
  warning: {
    50: 'hsl(45, 100%, 95%)',
    500: 'hsl(45, 100%, 50%)',
    900: 'hsl(45, 100%, 15%)',
  },
  
  error: {
    50: 'hsl(0, 70%, 95%)',
    500: 'hsl(0, 70%, 50%)',
    900: 'hsl(0, 70%, 15%)',
  },
  
  // Neutral colors
  neutral: {
    0: 'hsl(0, 0%, 100%)',
    50: 'hsl(0, 0%, 97%)',
    100: 'hsl(0, 0%, 93%)',
    200: 'hsl(0, 0%, 87%)',
    300: 'hsl(0, 0%, 80%)',
    400: 'hsl(0, 0%, 60%)',
    500: 'hsl(0, 0%, 50%)',
    600: 'hsl(0, 0%, 40%)',
    700: 'hsl(0, 0%, 30%)',
    800: 'hsl(0, 0%, 20%)',
    900: 'hsl(0, 0%, 10%)',
    1000: 'hsl(0, 0%, 0%)',
  },
} as const;

// Spacing tokens
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const;

// Typography tokens
export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// Border radius tokens
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const;

// Shadow tokens
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

// Transition tokens
export const transitions = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
  },
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Z-index tokens
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
} as const;

// Export all tokens
export const tokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  zIndex,
} as const;

export default tokens;