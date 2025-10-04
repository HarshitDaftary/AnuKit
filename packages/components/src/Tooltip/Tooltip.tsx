import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { useSSRSafeId, useKeyboardNavigation, useHover, useFocus } from '@optimui/core';

const lib = "optimui";
const l_prx = `${lib}-tooltip`;

export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  offset?: number;
  disabled?: boolean;
  className?: string;
  /** Show tooltip on hover (default: true) */
  showOnHover?: boolean;
  /** Show tooltip on focus (default: true) */
  showOnFocus?: boolean;
  /** Close tooltip on Escape key (default: true) */
  closeOnEscape?: boolean;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(({
  children,
  content,
  placement = 'top',
  delay = 300,
  offset = 8,
  disabled = false,
  className = '',
  showOnHover = true,
  showOnFocus = true,
  closeOnEscape = true
}, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipId = useSSRSafeId('tooltip');

  // Define handlers before hooks that reference them
  const showTooltip = () => {
    if (disabled) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Enhanced interaction hooks
  const { isHovered, hoverProps } = useHover({
    onHoverStart: showOnHover ? showTooltip : undefined,
    onHoverEnd: showOnHover ? hideTooltip : undefined,
    disabled,
  });

  const { isFocused, focusProps } = useFocus({
    onFocus: showOnFocus ? showTooltip : undefined,
    onBlur: showOnFocus ? hideTooltip : undefined,
    disabled,
  });

  const { handleKeyDown } = useKeyboardNavigation({
    onEscape: closeOnEscape ? hideTooltip : undefined,
  });

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = 0;
    let y = 0;

    switch (placement) {
      case 'top':
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.top - tooltipRect.height - offset;
        break;
      case 'bottom':
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.bottom + offset;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - offset;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
      case 'right':
        x = triggerRect.right + offset;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
    }

    // Keep tooltip within viewport
    x = Math.max(8, Math.min(x, viewportWidth - tooltipRect.width - 8));
    y = Math.max(8, Math.min(y, viewportHeight - tooltipRect.height - 8));

    setPosition({ x, y });
  };

  

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, placement, offset]);

  useEffect(() => {
    const handleKeyboardEvent = (event: KeyboardEvent) => {
      if (isVisible) {
        handleKeyDown(event);
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyboardEvent);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyboardEvent);
    };
  }, [isVisible, handleKeyDown]);

  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        calculatePosition();
      }
    };

    const handleScroll = () => {
      if (isVisible) {
        calculatePosition();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible]);

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900'
  };

  const tooltipClasses = [
    l_prx,
    'absolute',
    'z-50',
    'px-3',
    'py-2',
    'text-sm',
    'text-white',
    'bg-gray-900',
    'rounded-md',
    'shadow-lg',
    'pointer-events-none',
    'transition-opacity',
    'duration-200',
    isVisible ? 'opacity-100' : 'opacity-0',
    className
  ].filter(Boolean).join(' ');

  const clonedChild = React.cloneElement(children, {
    ref: triggerRef,
    ...hoverProps,
    ...focusProps,
    onMouseEnter: (e: React.MouseEvent) => {
      hoverProps.onMouseEnter?.();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hoverProps.onMouseLeave?.();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      focusProps.onFocus?.();
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      focusProps.onBlur?.();
      children.props.onBlur?.(e);
    },
    'aria-describedby': isVisible ? tooltipId : children.props['aria-describedby']
  });

  return (
    <>
      {clonedChild}
      {!disabled && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={tooltipClasses}
          style={{
            left: position.x,
            top: position.y,
            visibility: isVisible ? 'visible' : 'hidden'
          }}
        >
          {content}
          <div
            className={`absolute w-0 h-0 border-4 ${arrowClasses[placement]}`}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
});

Tooltip.displayName = 'Tooltip';

export { Tooltip };