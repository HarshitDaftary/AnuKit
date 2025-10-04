import React, { forwardRef } from 'react';
import { useReducedMotion, useSSRSafeId, cn } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-button`;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
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
  
  // Base classes for all buttons with Ant Design styling
  const baseClasses = [
    l_prx,
    'inline-flex',
    'items-center',
    'justify-center',
    'font-normal',
    'leading-5',
    'rounded',
    'border',
    'shadow-sm',
    'transition-all',
    'duration-200',
    'ease-in-out',
    'focus-visible:outline',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-40',
    'disabled:cursor-not-allowed',
    'cursor-pointer',
    // Add reduced motion support
    ...(reducedMotion ? ['transition-none'] : ['hover:-translate-y-0.5', 'hover:shadow-md', 'active:translate-y-0'])
  ];

  const getVariantClasses = (variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline') => {
    switch (variant) {
      case 'primary':
        return [`anukit-button-primary`];
      case 'secondary':
        return [`anukit-button-secondary`];
      case 'danger':
        return [`anukit-button-danger`];
      case 'ghost':
        return [`anukit-button-ghost`];
      case 'outline':
        return [`anukit-button-outline`];
      default:
        return [`anukit-button-primary`];
    }
  };

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return [`anukit-button-sm`];
      case 'md':
        return [`anukit-button-md`];
      case 'lg':
        return [`anukit-button-lg`];
      default:
        return [`anukit-button-md`];
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