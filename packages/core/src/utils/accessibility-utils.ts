/**
 * Accessibility utilities for OptimUI
 * Following WCAG 2.1 AA guidelines
 */

import { isClient } from './ssr-utils';

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Get all focusable elements within a container
   */
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    if (!isClient()) return [];

    const focusableSelector = [
      'button:not([disabled]):not([aria-hidden="true"])',
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"])',
      'select:not([disabled]):not([aria-hidden="true"])',
      'textarea:not([disabled]):not([aria-hidden="true"])',
      'a[href]:not([aria-hidden="true"])',
      '[tabindex]:not([tabindex="-1"]):not([aria-hidden="true"])',
      '[contenteditable="true"]:not([aria-hidden="true"])',
      'audio[controls]:not([aria-hidden="true"])',
      'video[controls]:not([aria-hidden="true"])',
      'iframe:not([aria-hidden="true"])',
      'object:not([aria-hidden="true"])',
      'embed:not([aria-hidden="true"])',
      'area[href]:not([aria-hidden="true"])',
      'summary:not([aria-hidden="true"])',
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelector))
      .filter((element) => {
        const el = element as HTMLElement;
        return (
          el.offsetWidth > 0 ||
          el.offsetHeight > 0 ||
          el.getClientRects().length > 0
        );
      }) as HTMLElement[];
  },

  /**
   * Get the first focusable element in a container
   */
  getFirstFocusable: (container: HTMLElement): HTMLElement | null => {
    const focusableElements = focusUtils.getFocusableElements(container);
    return focusableElements.length > 0 ? focusableElements[0] : null;
  },

  /**
   * Get the last focusable element in a container
   */
  getLastFocusable: (container: HTMLElement): HTMLElement | null => {
    const focusableElements = focusUtils.getFocusableElements(container);
    return focusableElements.length > 0 
      ? focusableElements[focusableElements.length - 1] 
      : null;
  },

  /**
   * Check if an element is focusable
   */
  isFocusable: (element: HTMLElement): boolean => {
    if (!isClient()) return false;
    
    const focusableElements = focusUtils.getFocusableElements(element.ownerDocument.body);
    return focusableElements.includes(element);
  },

  /**
   * Focus an element with optional scroll prevention
   */
  focusElement: (element: HTMLElement, preventScroll: boolean = false): void => {
    if (!isClient()) return;
    
    element.focus({ preventScroll });
  },

  /**
   * Create a focus trap within a container
   */
  createFocusTrap: (container: HTMLElement): (() => void) => {
    if (!isClient()) return () => {};

    const focusableElements = focusUtils.getFocusableElements(container);
    if (focusableElements.length === 0) return () => {};

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },
};

/**
 * ARIA utilities
 */
export const ariaUtils = {
  /**
   * Generate a unique ID for ARIA attributes
   */
  generateId: (prefix: string = 'optimui'): string => {
    return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
  },

  /**
   * Set ARIA attributes on an element
   */
  setAriaAttributes: (
    element: HTMLElement,
    attributes: Record<string, string | boolean | number | null>
  ): void => {
    if (!isClient()) return;

    Object.entries(attributes).forEach(([key, value]) => {
      const ariaKey = key.startsWith('aria-') ? key : `aria-${key}`;
      
      if (value === null || value === undefined) {
        element.removeAttribute(ariaKey);
      } else {
        element.setAttribute(ariaKey, String(value));
      }
    });
  },

  /**
   * Toggle ARIA expanded state
   */
  toggleExpanded: (element: HTMLElement): boolean => {
    if (!isClient()) return false;

    const current = element.getAttribute('aria-expanded') === 'true';
    const newState = !current;
    element.setAttribute('aria-expanded', String(newState));
    return newState;
  },

  /**
   * Set ARIA pressed state
   */
  setPressed: (element: HTMLElement, pressed: boolean): void => {
    if (!isClient()) return;
    element.setAttribute('aria-pressed', String(pressed));
  },

  /**
   * Set ARIA selected state
   */
  setSelected: (element: HTMLElement, selected: boolean): void => {
    if (!isClient()) return;
    element.setAttribute('aria-selected', String(selected));
  },

  /**
   * Set ARIA checked state
   */
  setChecked: (element: HTMLElement, checked: boolean | 'mixed'): void => {
    if (!isClient()) return;
    element.setAttribute('aria-checked', String(checked));
  },

  /**
   * Announce a message to screen readers
   */
  announce: (message: string, politeness: 'polite' | 'assertive' = 'polite'): void => {
    if (!isClient()) return;

    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', politeness);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;

    document.body.appendChild(announcer);

    setTimeout(() => {
      if (document.body.contains(announcer)) {
        document.body.removeChild(announcer);
      }
    }, 1000);
  },
};

/**
 * Color contrast utilities
 */
export const colorUtils = {
  /**
   * Convert hex color to RGB
   */
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  /**
   * Calculate relative luminance
   */
  getRelativeLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio: (color1: string, color2: string): number => {
    const rgb1 = colorUtils.hexToRgb(color1);
    const rgb2 = colorUtils.hexToRgb(color2);

    if (!rgb1 || !rgb2) return 0;

    const lum1 = colorUtils.getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = colorUtils.getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Check if color combination meets WCAG contrast requirements
   */
  meetsContrastRequirements: (
    foreground: string,
    background: string,
    level: 'AA' | 'AAA' = 'AA',
    size: 'normal' | 'large' = 'normal'
  ): boolean => {
    const ratio = colorUtils.getContrastRatio(foreground, background);
    
    const requirements = {
      'AA': { normal: 4.5, large: 3 },
      'AAA': { normal: 7, large: 4.5 },
    };

    return ratio >= requirements[level][size];
  },
};

/**
 * Keyboard navigation utilities
 */
export const keyboardUtils = {
  /**
   * Key codes for common navigation keys
   */
  KEYS: {
    TAB: 'Tab',
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End',
    PAGE_UP: 'PageUp',
    PAGE_DOWN: 'PageDown',
  } as const,

  /**
   * Check if a key event is a navigation key
   */
  isNavigationKey: (event: KeyboardEvent): boolean => {
    return Object.values(keyboardUtils.KEYS).includes(event.key as any);
  },

  /**
   * Check if a key event is a printable character
   */
  isPrintableCharacter: (event: KeyboardEvent): boolean => {
    return (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    );
  },

  /**
   * Handle roving tabindex navigation
   */
  handleRovingTabIndex: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    options: {
      orientation?: 'horizontal' | 'vertical' | 'both';
      wrap?: boolean;
      onIndexChange?: (newIndex: number) => void;
    } = {}
  ): void => {
    const { orientation = 'both', wrap = true, onIndexChange } = options;
    
    let newIndex = currentIndex;
    
    switch (event.key) {
      case keyboardUtils.KEYS.ARROW_RIGHT:
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = wrap 
            ? (currentIndex + 1) % items.length
            : Math.min(currentIndex + 1, items.length - 1);
          event.preventDefault();
        }
        break;
        
      case keyboardUtils.KEYS.ARROW_LEFT:
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = wrap
            ? (currentIndex - 1 + items.length) % items.length
            : Math.max(currentIndex - 1, 0);
          event.preventDefault();
        }
        break;
        
      case keyboardUtils.KEYS.ARROW_DOWN:
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = wrap
            ? (currentIndex + 1) % items.length
            : Math.min(currentIndex + 1, items.length - 1);
          event.preventDefault();
        }
        break;
        
      case keyboardUtils.KEYS.ARROW_UP:
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = wrap
            ? (currentIndex - 1 + items.length) % items.length
            : Math.max(currentIndex - 1, 0);
          event.preventDefault();
        }
        break;
        
      case keyboardUtils.KEYS.HOME:
        newIndex = 0;
        event.preventDefault();
        break;
        
      case keyboardUtils.KEYS.END:
        newIndex = items.length - 1;
        event.preventDefault();
        break;
    }
    
    if (newIndex !== currentIndex && items[newIndex]) {
      items.forEach((item, index) => {
        item.setAttribute('tabindex', index === newIndex ? '0' : '-1');
      });
      items[newIndex].focus();
      onIndexChange?.(newIndex);
    }
  },
};

/**
 * Screen reader utilities
 */
export const screenReaderUtils = {
  /**
   * Hide element from screen readers
   */
  hide: (element: HTMLElement): void => {
    if (!isClient()) return;
    element.setAttribute('aria-hidden', 'true');
  },

  /**
   * Show element to screen readers
   */
  show: (element: HTMLElement): void => {
    if (!isClient()) return;
    element.removeAttribute('aria-hidden');
  },

  /**
   * Create screen reader only content
   */
  createSROnly: (text: string): HTMLElement => {
    const element = document.createElement('span');
    element.textContent = text;
    element.className = 'sr-only';
    return element;
  },

  /**
   * Check if element is hidden from screen readers
   */
  isHidden: (element: HTMLElement): boolean => {
    return element.getAttribute('aria-hidden') === 'true';
  },
};

/**
 * Motion and animation utilities
 */
export const motionUtils = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion: (): boolean => {
    if (!isClient()) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Get appropriate animation duration based on user preference
   */
  getAnimationDuration: (
    normalDuration: number,
    reducedDuration: number = 0
  ): number => {
    return motionUtils.prefersReducedMotion() ? reducedDuration : normalDuration;
  },

  /**
   * Apply respectful animations
   */
  respectfulAnimate: (
    element: HTMLElement,
    animation: Keyframe[] | PropertyIndexedKeyframes,
    options: KeyframeAnimationOptions
  ): Animation | null => {
    if (!isClient()) return null;

    const respectfulOptions = {
      ...options,
      duration: motionUtils.getAnimationDuration(
        typeof options.duration === 'number' ? options.duration : 300,
        0
      ),
    };

    return element.animate(animation, respectfulOptions);
  },
};

/**
 * Form accessibility utilities
 */
export const formUtils = {
  /**
   * Associate label with form control
   */
  associateLabel: (label: HTMLLabelElement, control: HTMLElement): void => {
    if (!isClient()) return;
    
    const controlId = control.id || ariaUtils.generateId('control');
    control.id = controlId;
    label.setAttribute('for', controlId);
  },

  /**
   * Add error message to form control
   */
  addErrorMessage: (
    control: HTMLElement,
    errorElement: HTMLElement,
    errorMessage: string
  ): void => {
    if (!isClient()) return;

    const errorId = errorElement.id || ariaUtils.generateId('error');
    errorElement.id = errorId;
    errorElement.textContent = errorMessage;
    errorElement.setAttribute('role', 'alert');
    
    control.setAttribute('aria-invalid', 'true');
    control.setAttribute('aria-describedby', errorId);
  },

  /**
   * Remove error message from form control
   */
  removeErrorMessage: (control: HTMLElement): void => {
    if (!isClient()) return;
    
    control.removeAttribute('aria-invalid');
    control.removeAttribute('aria-describedby');
  },

  /**
   * Add helper text to form control
   */
  addHelperText: (
    control: HTMLElement,
    helperElement: HTMLElement,
    helperText: string
  ): void => {
    if (!isClient()) return;

    const helperId = helperElement.id || ariaUtils.generateId('helper');
    helperElement.id = helperId;
    helperElement.textContent = helperText;
    
    const existingDescribedBy = control.getAttribute('aria-describedby');
    const describedBy = existingDescribedBy 
      ? `${existingDescribedBy} ${helperId}`
      : helperId;
    
    control.setAttribute('aria-describedby', describedBy);
  },
};

export default {
  focusUtils,
  ariaUtils,
  colorUtils,
  keyboardUtils,
  screenReaderUtils,
  motionUtils,
  formUtils,
};