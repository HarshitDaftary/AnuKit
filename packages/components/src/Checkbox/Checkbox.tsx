import React, { forwardRef } from 'react';
import { useSSRSafeId } from '@anukit/core/providers/SSRProvider';
import { encodeSizeMode } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-checkbox`;

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  indeterminate?: boolean;
  error?: string;
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 14 14"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7l3 3 6-6"
    />
  </svg>
);

const IndeterminateIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 14 14"
  >
    <rect x="2" y="6" width="10" height="2" rx="1" />
  </svg>
);

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  size = 'md',
  label,
  description,
  indeterminate = false,
  error,
  className = '',
  id,
  checked,
  ...props
}, ref) => {
  const generatedId = useSSRSafeId('checkbox');
  const checkboxId = id || generatedId;
  const errorId = `${checkboxId}-error`;
  const descriptionId = `${checkboxId}-description`;

  const hasError = Boolean(error);

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return {
          checkbox: 'h-4 w-4',
          icon: 'h-3 w-3',
          label: 'text-sm',
          description: 'text-xs'
        };
      case 'md':
        return {
          checkbox: 'h-5 w-5',
          icon: 'h-4 w-4',
          label: 'text-sm',
          description: 'text-sm'
        };
      case 'lg':
        return {
          checkbox: 'h-6 w-6',
          icon: 'h-5 w-5',
          label: 'text-base',
          description: 'text-sm'
        };
      default:
        return {
          checkbox: 'h-5 w-5',
          icon: 'h-4 w-4',
          label: 'text-sm',
          description: 'text-sm'
        };
    }
  };

  const baseCheckboxClasses = [
    l_prx,
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded',
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
        'focus:ring-red-500',
        checked || indeterminate ? 'bg-red-500 border-red-500' : ''
      ]
    : [
        'border-gray-300',
        'focus:ring-blue-500',
        checked || indeterminate ? 'bg-blue-600 border-blue-600' : 'hover:border-gray-400'
      ];

  const checkboxClasses = [
    ...baseCheckboxClasses,
    ...stateClasses,
    getSizeClasses(size).checkbox,
    className
  ].filter(Boolean).join(' ');

  const iconClasses = [
    'absolute',
    'text-white',
    'transition-opacity',
    'duration-200',
    getSizeClasses(size).icon,
    (checked || indeterminate) ? 'opacity-100' : 'opacity-0'
  ].join(' ');

  // Handle indeterminate state
  React.useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate, ref]);

  return (
    <div className="flex items-start">
      <div className="flex items-center">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="sr-only"
            checked={checked}
            aria-invalid={hasError}
            aria-describedby={[
              error ? errorId : null,
              description ? descriptionId : null
            ].filter(Boolean).join(' ') || undefined}
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={checkboxClasses}
            aria-hidden="true"
          >
            {indeterminate ? (
              <IndeterminateIcon className={iconClasses} />
            ) : (
              <CheckIcon className={iconClasses} />
            )}
          </label>
        </div>
      </div>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label
              htmlFor={checkboxId}
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

Checkbox.displayName = 'Checkbox';

export { Checkbox };