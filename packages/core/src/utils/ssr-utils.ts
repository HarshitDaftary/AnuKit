/**
 * SSR-safe utilities for OptimUI
 */

/**
 * Check if code is running on server
 */
export const isServer = (): boolean => {
  return typeof window === 'undefined';
};

/**
 * Check if code is running on client
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Safely access browser APIs
 */
export const safeWindow = (): Window | undefined => {
  return isClient() ? window : undefined;
};

export const safeDocument = (): Document | undefined => {
  return isClient() ? document : undefined;
};

export const safeNavigator = (): Navigator | undefined => {
  return isClient() ? navigator : undefined;
};

/**
 * SSR-safe event listener management
 */
export const addEventListenerSSR = (
  element: EventTarget | null,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): (() => void) => {
  if (!isClient() || !element) {
    return () => {};
  }

  element.addEventListener(event, handler, options);
  
  return () => {
    element.removeEventListener(event, handler, options);
  };
};

/**
 * SSR-safe CSS custom property management
 */
export const setCSSProperty = (
  property: string,
  value: string,
  element?: HTMLElement
): void => {
  if (!isClient()) return;
  
  const target = element || document.documentElement;
  target.style.setProperty(property, value);
};

export const getCSSProperty = (
  property: string,
  element?: HTMLElement
): string => {
  if (!isClient()) return '';
  
  const target = element || document.documentElement;
  return getComputedStyle(target).getPropertyValue(property);
};

/**
 * SSR-safe style injection
 */
export const injectStyles = (css: string, id?: string): void => {
  if (!isClient()) return;
  
  const styleId = id || `optimui-styles-${Date.now()}`;
  
  // Remove existing style if it exists
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = css;
  document.head.appendChild(style);
};

/**
 * SSR-safe class name management
 */
export const addClass = (element: HTMLElement | null, className: string): void => {
  if (!isClient() || !element) return;
  element.classList.add(className);
};

export const removeClass = (element: HTMLElement | null, className: string): void => {
  if (!isClient() || !element) return;
  element.classList.remove(className);
};

export const toggleClass = (
  element: HTMLElement | null, 
  className: string, 
  force?: boolean
): void => {
  if (!isClient() || !element) return;
  element.classList.toggle(className, force);
};

/**
 * SSR-safe body class management
 */
export const addBodyClass = (className: string): (() => void) => {
  if (!isClient()) return () => {};
  
  document.body.classList.add(className);
  
  return () => {
    document.body.classList.remove(className);
  };
};

/**
 * SSR-safe scroll management
 */
export const disableScroll = (): (() => void) => {
  if (!isClient()) return () => {};
  
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  
  return () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  };
};

/**
 * SSR-safe animation utilities
 */
export const requestAnimationFrameSSR = (callback: FrameRequestCallback): number => {
  if (!isClient()) return 0;
  return requestAnimationFrame(callback);
};

export const cancelAnimationFrameSSR = (id: number): void => {
  if (!isClient()) return;
  cancelAnimationFrame(id);
};

/**
 * SSR-safe timeout utilities
 */
export const setTimeoutSSR = (
  callback: () => void, 
  delay: number
): NodeJS.Timeout | number => {
  if (!isClient()) return 0;
  return setTimeout(callback, delay);
};

export const clearTimeoutSSR = (id: NodeJS.Timeout | number): void => {
  if (!isClient()) return;
  clearTimeout(id as NodeJS.Timeout);
};

/**
 * SSR-safe URL utilities
 */
export const getCurrentURL = (): string => {
  if (!isClient()) return '';
  return window.location.href;
};

export const getSearchParams = (): URLSearchParams => {
  if (!isClient()) return new URLSearchParams();
  return new URLSearchParams(window.location.search);
};

/**
 * SSR-safe feature detection
 */
export const supportsIntersectionObserver = (): boolean => {
  if (!isClient()) return false;
  return 'IntersectionObserver' in window;
};

export const supportsResizeObserver = (): boolean => {
  if (!isClient()) return false;
  return 'ResizeObserver' in window;
};

export const supportsTouchEvents = (): boolean => {
  if (!isClient()) return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const supportsHover = (): boolean => {
  if (!isClient()) return false;
  return window.matchMedia('(hover: hover)').matches;
};

/**
 * SSR-safe performance utilities
 */
export const measurePerformance = (name: string, fn: () => void): void => {
  if (!isClient() || !performance.mark) {
    fn();
    return;
  }
  
  performance.mark(`${name}-start`);
  fn();
  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);
};

/**
 * SSR-safe DOM utilities
 */
export const getElementRect = (element: HTMLElement | null): DOMRect | null => {
  if (!isClient() || !element) return null;
  return element.getBoundingClientRect();
};

export const isElementInViewport = (element: HTMLElement | null): boolean => {
  if (!isClient() || !element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
};

/**
 * SSR-safe storage utilities with fallbacks
 */
export const getStorageItem = (key: string, storage: 'local' | 'session' = 'local'): string | null => {
  if (!isClient()) return null;
  
  try {
    const storageObj = storage === 'local' ? localStorage : sessionStorage;
    return storageObj.getItem(key);
  } catch {
    return null;
  }
};

export const setStorageItem = (
  key: string, 
  value: string, 
  storage: 'local' | 'session' = 'local'
): boolean => {
  if (!isClient()) return false;
  
  try {
    const storageObj = storage === 'local' ? localStorage : sessionStorage;
    storageObj.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export const removeStorageItem = (key: string, storage: 'local' | 'session' = 'local'): boolean => {
  if (!isClient()) return false;
  
  try {
    const storageObj = storage === 'local' ? localStorage : sessionStorage;
    storageObj.removeItem(key);
    return true;
  } catch {
    return false;
  }
};