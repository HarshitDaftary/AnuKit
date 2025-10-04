import React, { forwardRef, useRef } from 'react';
import { cn, useSSRSafeId, useReducedMotion } from '@anukit/utils';
import { encodeSizeMode } from '@anukit/utils';

const lib = "anukit";

const l_prx = `${lib}-button`;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  /** Accessible label for screen readers when children is not descriptive */
  'aria-label'?: string;
  /** ID of element that describes the button */
  'aria-describedby'?: string;
  /** Indicates if button controls a popup */
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  /** Indicates if controlled content is expanded */
  'aria-expanded'?: boolean;
  /** Indicates current pressed state for toggle buttons */
  'aria-pressed'?: boolean;
}

const Button = /* @__PURE__ */ forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-haspopup': ariaHasPopup,
  'aria-expanded': ariaExpanded,
  'aria-pressed': ariaPressed,
  ...props
}, ref) => {
  const id = useSSRSafeId('btn');
  const reducedMotion = useReducedMotion();
  
  const baseClasses = [
    l_prx,
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-md',
    'transition-colors',
    'focus-visible:outline',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'disabled:opacity-50',
    'disabled:pointer-events-none',
    // Add reduced motion support
    ...(reducedMotion ? ['transition-none'] : [])
  ];

  const getVariantClasses = (variant: 'primary' | 'secondary' | 'danger' | 'ghost') => {
    switch (variant) {
      case 'primary':
        return [
          'bg-blue-600',
          'text-white',
          'hover:bg-blue-700',
          'focus-visible:outline-blue-600'
        ];
      case 'secondary':
        return [
          'bg-gray-100',
          'text-gray-900',
          'hover:bg-gray-200',
          'focus-visible:outline-gray-600'
        ];
      case 'danger':
        return [
          'bg-red-600',
          'text-white',
          'hover:bg-red-700',
          'focus-visible:outline-red-600'
        ];
      case 'ghost':
        return [
          'bg-transparent',
          'text-gray-700',
          'hover:bg-gray-100',
          'focus-visible:outline-gray-600'
        ];
      default:
        return [
          'bg-blue-600',
          'text-white',
          'hover:bg-blue-700',
          'focus-visible:outline-blue-600'
        ];
    }
  };

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return ['px-3', 'py-1.5', 'text-sm'];
      case 'md':
        return ['px-4', 'py-2', 'text-sm'];
      case 'lg':
        return ['px-6', 'py-3', 'text-base'];
      default:
        return ['px-4', 'py-2', 'text-sm'];
    }
  };

  const classes = cn(
    ...baseClasses,
    ...getVariantClasses(variant),
    ...getSizeClasses(size),
    className
  );

  return (
    <button
      ref={ref}
      id={id}
      className={classes}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-haspopup={ariaHasPopup}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
            role="presentation"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };