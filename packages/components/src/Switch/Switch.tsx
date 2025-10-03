import React, { forwardRef } from 'react';
import { useSSRSafeId } from '@optimui/core/providers/SSRProvider';
import { encodeSizeMode } from '@optimui/utils/sizeMode';

const lib = "optimui";
const l_prx = `${lib}-switch`;

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  error?: string;
  labelPosition?: 'left' | 'right';
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  size = 'md',
  label,
  description,
  error,
  labelPosition = 'right',
  className = '',
  id,
  checked = false,
  ...props
}, ref) => {
  const generatedId = useSSRSafeId('switch');
  const switchId = id || generatedId;
  const errorId = `${switchId}-error`;
  const descriptionId = `${switchId}-description`;

  const hasError = Boolean(error);

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return {
          track: 'h-5 w-9',
          thumb: 'h-4 w-4',
          translate: checked ? 'translate-x-4' : 'translate-x-0',
          label: 'text-sm',
          description: 'text-xs'
        };
      case 'md':
        return {
          track: 'h-6 w-11',
          thumb: 'h-5 w-5',
          translate: checked ? 'translate-x-5' : 'translate-x-0',
          label: 'text-sm',
          description: 'text-sm'
        };
      case 'lg':
        return {
          track: 'h-7 w-14',
          thumb: 'h-6 w-6',
          translate: checked ? 'translate-x-7' : 'translate-x-0',
          label: 'text-base',
          description: 'text-sm'
        };
      default:
        return {
          track: 'h-6 w-11',
          thumb: 'h-5 w-5',
          translate: checked ? 'translate-x-5' : 'translate-x-0',
          label: 'text-sm',
          description: 'text-sm'
        };
    }
  };

  const baseTrackClasses = [
    `${l_prx}-track`,
    'relative',
    'inline-flex',
    'items-center',
    'rounded-full',
    'border-2',
    'border-transparent',
    'transition-colors',
    'duration-200',
    'ease-in-out',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'cursor-pointer'
  ];

  const stateClasses = hasError
    ? [
        'focus:ring-red-500',
        checked ? 'bg-red-500' : 'bg-gray-200'
      ]
    : [
        'focus:ring-blue-500',
        checked ? 'bg-blue-600' : 'bg-gray-200'
      ];

  const trackClasses = [
    ...baseTrackClasses,
    ...stateClasses,
    getSizeClasses(size).track
  ].join(' ');

  const thumbClasses = [
    `${l_prx}-thumb`,
    'pointer-events-none',
    'absolute',
    'top-0.5',
    'left-0.5',
    'inline-block',
    'rounded-full',
    'bg-white',
    'shadow',
    'transform',
    'ring-0',
    'transition',
    'duration-200',
    'ease-in-out',
    getSizeClasses(size).thumb,
    getSizeClasses(size).translate
  ].join(' ');

  const LabelContent = () => (
    <>
      {label && (
        <span className={`block font-medium text-gray-700 ${getSizeClasses(size).label}`}>
          {label}
        </span>
      )}
      {description && (
        <span
          id={descriptionId}
          className={`text-gray-500 ${getSizeClasses(size).description} ${label ? 'mt-1' : ''}`}
        >
          {description}
        </span>
      )}
      {error && (
        <span id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </span>
      )}
    </>
  );

  const switchElement = (
    <div className="flex items-center">
      <input
        ref={ref}
        type="checkbox"
        id={switchId}
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
        htmlFor={switchId}
        className={`${trackClasses} ${className}`}
        aria-hidden="true"
      >
        <span className={thumbClasses} />
      </label>
    </div>
  );

  if (!label && !description) {
    return (
      <div>
        {switchElement}
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-start">
      {labelPosition === 'left' && (
        <div className="mr-3">
          <LabelContent />
        </div>
      )}
      {switchElement}
      {labelPosition === 'right' && (
        <div className="ml-3">
          <LabelContent />
        </div>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';

export { Switch };