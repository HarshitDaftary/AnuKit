import { useState, useEffect, useMemo } from 'react';
import { useSSRContext } from '../providers/SSRProvider';

/**
 * SSR-safe media query hook
 * Returns false during SSR and actual value after hydration
 */
export const useMediaQuery = (query: string): boolean => {
  const { isClient } = useSSRContext();
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!isClient) return;

    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query, isClient]);

  return isClient ? matches : false;
};

/**
 * SSR-safe window size hook
 */
export const useWindowSize = () => {
  const { isClient } = useSSRContext();
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);

  return windowSize;
};

/**
 * SSR-safe localStorage hook
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const { isClient } = useSSRContext();
  
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isClient) return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    if (!isClient) return;
    
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key, isClient]);

  return [storedValue, setValue];
};

/**
 * SSR-safe theme detection hook
 */
export const useTheme = () => {
  const { isClient } = useSSRContext();
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'auto'>('optimui-theme', 'auto');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (!isClient) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const listener = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [isClient]);

  const resolvedTheme = useMemo(() => {
    if (theme === 'auto') {
      return systemTheme;
    }
    return theme;
  }, [theme, systemTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    systemTheme,
  };
};

/**
 * SSR-safe portal hook
 */
export const usePortal = (containerId: string = 'portal-root') => {
  const { isClient } = useSSRContext();
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isClient) return;

    let element = document.getElementById(containerId);
    
    if (!element) {
      element = document.createElement('div');
      element.id = containerId;
      document.body.appendChild(element);
    }
    
    setContainer(element);

    return () => {
      // Clean up if this was the last component using the portal
      if (element && element.children.length === 0) {
        document.body.removeChild(element);
      }
    };
  }, [containerId, isClient]);

  return container;
};

/**
 * SSR-safe focus management hook
 */
export const useFocusManagement = () => {
  const { isClient } = useSSRContext();

  const trapFocus = (element: HTMLElement) => {
    if (!isClient) return;

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  };

  const restoreFocus = (previousElement: HTMLElement | null) => {
    if (!isClient || !previousElement) return;
    
    previousElement.focus();
  };

  return { trapFocus, restoreFocus };
};

export default {
  useMediaQuery,
  useWindowSize,
  useLocalStorage,
  useTheme,
  usePortal,
  useFocusManagement,
};