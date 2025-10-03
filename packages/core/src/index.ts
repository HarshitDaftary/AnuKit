// Core exports
export { SSRProvider, useSSRContext, useSSRSafeId, extractCriticalCSS, hydrateStyles } from './providers/SSRProvider';

// Hooks
export {
  useMediaQuery,
  useWindowSize,
  useLocalStorage,
  useTheme,
  usePortal,
  useFocusManagement,
} from './hooks/ssr-hooks';

// Accessibility Hooks
export {
  useAriaLive,
  useKeyboardNavigation,
  useFocusWithin,
  useRovingTabIndex,
  useReducedMotion,
  useDisclosure,
  usePress,
  useHover,
  useFocus,
  useAriaDescription,
} from './hooks/accessibility-hooks';

// Form Hooks
export {
  useForm,
  useField,
  useValidation,
  validateValue,
} from './hooks/form-hooks';

// Form Hook Types
export type {
  ValidationRule,
  FieldConfig,
  FieldState,
  FormConfig,
  UseFormReturn,
} from './hooks/form-hooks';

// Utilities
export {
  isServer,
  isClient,
  safeWindow,
  safeDocument,
  safeNavigator,
  addEventListenerSSR,
  setCSSProperty,
  getCSSProperty,
  injectStyles,
  addClass,
  removeClass,
  toggleClass,
  addBodyClass,
  disableScroll,
  requestAnimationFrameSSR,
  cancelAnimationFrameSSR,
  setTimeoutSSR,
  clearTimeoutSSR,
  getCurrentURL,
  getSearchParams,
  supportsIntersectionObserver,
  supportsResizeObserver,
  supportsTouchEvents,
  supportsHover,
  measurePerformance,
  getElementRect,
  isElementInViewport,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from './utils/ssr-utils';

// Accessibility Utilities
export {
  focusUtils,
  ariaUtils,
  colorUtils,
  keyboardUtils,
  screenReaderUtils,
  motionUtils,
  formUtils,
} from './utils/accessibility-utils';

// Testing utilities
export {
  testSSRCompatibility,
  testProgressiveEnhancement,
  measureHydrationTime,
  testSSRAccessibility,
  testThemeCompatibility,
  testResponsiveSSR,
} from './testing/ssr-test-utils';