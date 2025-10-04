import React, { forwardRef } from 'react';
import { useSSRSafeId } from '@optimui/core';
import { encodeSizeMode } from '@optimui/utils/sizeMode';

const lib = "optimui";
const l_prx = `${lib}-radio`;

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  error?: string;
}

export interface RadioGroupProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  className?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  size = 'md',
  label,
  description,
  error,
  className = '',
  id,
  checked = false,
  ...props
}, ref) => {
  const generatedId = useSSRSafeId('radio');
  const radioId = id || generatedId;
  const errorId = `${radioId}-error`;
  const descriptionId = `${radioId}-description`;

  const hasError = Boolean(error);

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return {
          radio: 'h-4 w-4',
          dot: 'h-2 w-2',
          label: 'text-sm',
          description: 'text-xs'
        };
      case 'md':
        return {
          radio: 'h-5 w-5',
          dot: 'h-2.5 w-2.5',
          label: 'text-sm',
          description: 'text-sm'
        };
      case 'lg':
        return {
          radio: 'h-6 w-6',
          dot: 'h-3 w-3',
          label: 'text-base',
          description: 'text-sm'
        };
      default:
        return {
          radio: 'h-5 w-5',
          dot: 'h-2.5 w-2.5',
          label: 'text-sm',
          description: 'text-sm'
        };
    }
  };

  const baseRadioClasses = [
    l_prx,
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'border-2',
    'bg-white',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'cursor-pointer'
  ];

  const stateClasses = hasError
    ? [
        'border-red-500',
        'focus:ring-red-500'
      ]
    : [
        'border-gray-300',
        'focus:ring-blue-500',
        'hover:border-gray-400'
      ];

  const radioClasses = [
    ...baseRadioClasses,
    ...stateClasses,
    getSizeClasses(size).radio,
    `${l_prx}-${encodeSizeMode(size)}`,
    className
  ].filter(Boolean).join(' ');

  const dotClasses = [
    'absolute',
    'rounded-full',
    'bg-current',
    'transition-opacity',
    'duration-200',
    getSizeClasses(size).dot,
    checked ? 'opacity-100' : 'opacity-0'
  ].join(' ');

  return (
    <div className="flex items-start">
      <div className="flex items-center">
        <div className="relative">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            className="sr-only"
            aria-invalid={hasError}
            aria-describedby={[
              error ? errorId : null,
              description ? descriptionId : null
            ].filter(Boolean).join(' ') || undefined}
            {...props}
          />
          <label
            htmlFor={radioId}
            className={radioClasses}
            aria-hidden="true"
          >
            <span
              className={`${dotClasses} ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
            />
          </label>
        </div>
      </div>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label
              htmlFor={radioId}
              className={`block font-medium text-gray-700 cursor-pointer ${getSizeClasses(size).label}`}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={descriptionId}
              className={`text-gray-500 ${getSizeClasses(size).description} ${label ? 'mt-1' : ''}`}
            >
              {description}
            </p>
          )}
          {error && (
            <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
      {!label && !description && error && (
        <p id={errorId} className="ml-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

const RadioGroup = ({ children, label, error, className = '' }: RadioGroupProps) => {
  const generatedId = useSSRSafeId('radio-group');
  const errorId = error ? `${generatedId}-error` : undefined;

  return (
    <fieldset className={className} aria-describedby={errorId}>
      {label && (
        <legend className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </legend>
      )}
      <div className="space-y-2">
        {children}
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
};

Radio.displayName = 'Radio';
RadioGroup.displayName = 'RadioGroup';

export { Radio, RadioGroup };