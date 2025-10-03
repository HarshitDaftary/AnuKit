import { useState, useEffect, useRef, useCallback } from 'react';
import { useSSRContext } from '../providers/SSRProvider';

/**
 * Hook for managing ARIA live regions
 * Announces messages to screen readers
 */
export const useAriaLive = (politeness: 'polite' | 'assertive' = 'polite') => {
  const { isClient } = useSSRContext();
  const [liveRegion, setLiveRegion] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isClient) return;

    const region = document.createElement('div');
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only optimui-live-region';
    document.body.appendChild(region);
    setLiveRegion(region);

    return () => {
      if (document.body.contains(region)) {
        document.body.removeChild(region);
      }
    };
  }, [isClient, politeness]);

  const announce = useCallback((message: string) => {
    if (liveRegion) {
      liveRegion.textContent = message;
      // Clear after announcement to allow repeated messages
      setTimeout(() => {
        if (liveRegion) liveRegion.textContent = '';
      }, 1000);
    }
  }, [liveRegion]);

  return announce;
};

/**
 * Hook for keyboard navigation patterns
 */
export const useKeyboardNavigation = (options: {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
}) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        options.onEscape?.();
        break;
      case 'Enter':
        options.onEnter?.();
        break;
      case 'ArrowUp':
        event.preventDefault();
        options.onArrowUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        options.onArrowDown?.();
        break;
      case 'ArrowLeft':
        options.onArrowLeft?.();
        break;
      case 'ArrowRight':
        options.onArrowRight?.();
        break;
      case 'Home':
        event.preventDefault();
        options.onHome?.();
        break;
      case 'End':
        event.preventDefault();
        options.onEnd?.();
        break;
      case 'Tab':
        if (event.shiftKey) {
          options.onShiftTab?.();
        } else {
          options.onTab?.();
        }
        break;
    }
  }, [options]);

  return { handleKeyDown };
};

/**
 * Hook for managing focus within a specific container
 */
export const useFocusWithin = () => {
  const [focusWithin, setFocusWithin] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleFocusIn = () => setFocusWithin(true);
    const handleFocusOut = (event: FocusEvent) => {
      if (!container.contains(event.relatedTarget as Node)) {
        setFocusWithin(false);
      }
    };

    container.addEventListener('focusin', handleFocusIn);
    container.addEventListener('focusout', handleFocusOut);

    return () => {
      container.removeEventListener('focusin', handleFocusIn);
      container.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return { focusWithin, containerRef };
};

/**
 * Hook for managing roving tabindex pattern
 */
export const useRovingTabIndex = <T extends HTMLElement>(
  items: T[],
  defaultIndex: number = 0
) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const setTabIndexes = useCallback(() => {
    items.forEach((item, index) => {
      if (item) {
        item.setAttribute('tabindex', index === activeIndex ? '0' : '-1');
      }
    });
  }, [items, activeIndex]);

  useEffect(() => {
    setTabIndexes();
  }, [setTabIndexes]);

  const moveToNext = useCallback(() => {
    const nextIndex = (activeIndex + 1) % items.length;
    setActiveIndex(nextIndex);
    items[nextIndex]?.focus();
  }, [activeIndex, items]);

  const moveToPrevious = useCallback(() => {
    const prevIndex = (activeIndex - 1 + items.length) % items.length;
    setActiveIndex(prevIndex);
    items[prevIndex]?.focus();
  }, [activeIndex, items]);

  const moveToFirst = useCallback(() => {
    setActiveIndex(0);
    items[0]?.focus();
  }, [items]);

  const moveToLast = useCallback(() => {
    const lastIndex = items.length - 1;
    setActiveIndex(lastIndex);
    items[lastIndex]?.focus();
  }, [items]);

  const moveTo = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      setActiveIndex(index);
      items[index]?.focus();
    }
  }, [items]);

  return {
    activeIndex,
    moveToNext,
    moveToPrevious,
    moveToFirst,
    moveToLast,
    moveTo,
  };
};

/**
 * Hook for detecting reduced motion preference
 */
export const useReducedMotion = () => {
  const { isClient } = useSSRContext();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!isClient) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isClient]);

  return reducedMotion;
};

/**
 * Hook for managing disclosure state (collapsible content)
 */
export const useDisclosure = (defaultOpen: boolean = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

/**
 * Hook for managing press interactions (mouse + keyboard)
 */
export const usePress = (options: {
  onPress?: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
  disabled?: boolean;
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const pressProps = {
    onMouseDown: () => {
      if (options.disabled) return;
      setIsPressed(true);
      options.onPressStart?.();
    },
    onMouseUp: () => {
      if (options.disabled) return;
      setIsPressed(false);
      options.onPressEnd?.();
    },
    onMouseLeave: () => {
      if (options.disabled) return;
      setIsPressed(false);
      options.onPressEnd?.();
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      if (options.disabled) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsPressed(true);
        options.onPressStart?.();
        options.onPress?.();
      }
    },
    onKeyUp: (event: React.KeyboardEvent) => {
      if (options.disabled) return;
      if (event.key === 'Enter' || event.key === ' ') {
        setIsPressed(false);
        options.onPressEnd?.();
      }
    },
    onClick: () => {
      if (options.disabled) return;
      options.onPress?.();
    },
  };

  return { isPressed, pressProps };
};

/**
 * Hook for managing hover interactions
 */
export const useHover = (options: {
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  disabled?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverProps = {
    onMouseEnter: () => {
      if (options.disabled) return;
      setIsHovered(true);
      options.onHoverStart?.();
    },
    onMouseLeave: () => {
      if (options.disabled) return;
      setIsHovered(false);
      options.onHoverEnd?.();
    },
  };

  return { isHovered, hoverProps };
};

/**
 * Hook for managing focus interactions
 */
export const useFocus = (options: {
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const focusProps = {
    onFocus: () => {
      if (options.disabled) return;
      setIsFocused(true);
      options.onFocus?.();
    },
    onBlur: () => {
      if (options.disabled) return;
      setIsFocused(false);
      options.onBlur?.();
    },
  };

  return { isFocused, focusProps };
};

/**
 * Hook for creating accessible descriptions
 */
export const useAriaDescription = (description?: string) => {
  const { isClient } = useSSRContext();
  const [descriptionId, setDescriptionId] = useState<string>();
  const descriptionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isClient || !description) return;

    const id = `description-${Math.random().toString(36).substring(2, 9)}`;
    setDescriptionId(id);

    return () => setDescriptionId(undefined);
  }, [isClient, description]);

  const descriptionProps = description ? {
    id: descriptionId,
    ref: descriptionRef,
  } : {};

  return {
    'aria-describedby': description ? descriptionId : undefined,
    descriptionProps,
  };
};

export default {
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
};