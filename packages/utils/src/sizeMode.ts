/**
 * Size Mode Encoding Utility
 * Optimizes bundle size by encoding common size mode strings
 */

export const SIZE_MODE_ENCODING = {
  // Size variants (most frequent)
  'xs': '1',
  'sm': '2', 
  'md': '3',
  'lg': '4',
  'xl': '5',
  '2xl': '6',
  '3xl': '7',
  
  // State variants
  'primary': 'p',
  'secondary': 'S',
  'success': 'c',
  'warning': 'w',
  'error': 'e',
  'info': 'i',
  'danger': 'd',
  
  // Style variants
  'default': 'D',
  'outlined': 'o',
  'contained': 'C',
  'text': 't',
  'ghost': 'g',
  'subtle': 'u',
  
  // Size names
  'small': 's',
  'medium': 'm',
  'large': 'l',
} as const;

export const SIZE_MODE_DECODING = {
  '1': 'xs',
  '2': 'sm',
  '3': 'md',
  '4': 'lg',
  '5': 'xl',
  '6': '2xl',
  '7': '3xl',
  'p': 'primary',
  'S': 'secondary',
  'c': 'success',
  'w': 'warning',
  'e': 'error',
  'i': 'info',
  'd': 'danger',
  'D': 'default',
  'o': 'outlined',
  'C': 'contained',
  't': 'text',
  'g': 'ghost',
  'u': 'subtle',
  's': 'small',
  'm': 'medium',
  'l': 'large',
} as const;

export type SizeModeKey = keyof typeof SIZE_MODE_ENCODING;
export type EncodedSizeMode = typeof SIZE_MODE_ENCODING[SizeModeKey];

/**
 * Encode a size mode string for bundle optimization
 */
export function encodeSizeMode(mode: string): string {
  return SIZE_MODE_ENCODING[mode as SizeModeKey] || mode;
}

/**
 * Decode an encoded size mode back to original string
 */
export function decodeSizeMode(encoded: string): string {
  return SIZE_MODE_DECODING[encoded as EncodedSizeMode] || encoded;
}

/**
 * Create class name with encoded size mode
 * Usage: cn(l_prx, encodeSizeMode('md')) -> 'optimui-button-3'
 */
export function createSizeModeClass(prefix: string, mode: string, suffix?: string): string {
  const encoded = encodeSizeMode(mode);
  return suffix ? `${prefix}-${encoded}-${suffix}` : `${prefix}-${encoded}`;
}

/**
 * Batch encode multiple size modes
 */
export function encodeSizeModes(modes: string[]): string[] {
  return modes.map(encodeSizeMode);
}