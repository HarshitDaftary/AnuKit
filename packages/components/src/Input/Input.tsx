/**
 * Input Component
 * Basic text input with multiple variants and sizes
 */

import React, { forwardRef } from 'react';
import { useSSRSafeId, encodeSizeMode as enc, cn, CSS_UTILITIES } from '@anukit/utils';

const lib = "anukit";

const l_prx = `${lib}-input`;

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'md',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  id: providedId,
  ...props
}, ref) => {
  const generatedId = useSSRSafeId('input');
  const id = providedId || generatedId;
  const labelId = label ? `${id}-label` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const helperTextId = helperText ? `${id}-helper` : undefined;

  const hasError = enc(variant) === enc('error') || Boolean(error);
  const hasSuccess = enc(variant) === enc('success');

  const baseClasses = [
    CSS_UTILITIES.INPUT_BASE,
    CSS_UTILITIES.DISABLED,
    fullWidth ? 'w-full' : ''
  ];

  const variantClasses = {
    [enc('default')]: [
      'border-gray-300',
      'focus:border-blue-500',
      'focus:ring-blue-500'
    ],
    [enc('error')]: [
      'border-red-300',
      'focus:border-red-500', 
      'focus:ring-red-500'
    ],
    [enc('success')]: [
      'border-green-300',
      'focus:border-green-500',
      'focus:ring-green-500'
    ]
  };

  const sizeClasses = {
    [enc('sm')]: ['px-3', 'py-1.5', 'text-sm'],
    [enc('md')]: ['px-3', 'py-2', 'text-sm'],
    [enc('lg')]: ['px-4', 'py-3', 'text-base']
  };

  const iconSpacing = {
    left: leftIcon ? (enc(size) === enc('lg') ? 'pl-10' : 'pl-8') : '',
    right: rightIcon ? (enc(size) === enc('lg') ? 'pr-10' : 'pr-8') : ''
  };

  const inputClasses = [
    ...baseClasses,
    ...variantClasses[enc(hasError ? 'error' : hasSuccess ? 'success' : 'default')],
    ...sizeClasses[enc(size)],
    iconSpacing.left,
    iconSpacing.right,
    className
  ].filter(Boolean).join(' ');

  const iconSizeClasses = {
    [enc('sm')]: 'h-4 w-4',
    [enc('md')]: 'h-5 w-5',
    [enc('lg')]: 'h-6 w-6'
  };

  const iconPosition = {
    left: enc(size) === enc('lg') ? 'left-3' : 'left-2.5',
    right: enc(size) === enc('lg') ? 'right-3' : 'right-2.5'
  };

  const iconClasses = iconSizeClasses[enc(size)];

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          id={labelId}
          htmlFor={id}
          className={`block text-sm font-medium mb-1 ${
            hasError ? 'text-red-700' : hasSuccess ? 'text-green-700' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className={`absolute ${iconPosition.left} top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none`}>
            <div className={iconClasses}>
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          id={id}
          className={inputClasses}
          aria-labelledby={labelId}
          aria-describedby={[errorId, helperTextId].filter(Boolean).join(' ') || undefined}
          aria-invalid={hasError ? 'true' : undefined}
          {...props}
        />
        
        {rightIcon && (
          <div className={`absolute ${iconPosition.right} top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none`}>
            <div className={iconClasses}>
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="mt-1">
          {error && (
            <p id={errorId} className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p id={helperTextId} className="text-sm text-gray-500">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };