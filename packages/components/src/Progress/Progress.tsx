import React, { forwardRef } from 'react';
import { encodeSizeMode } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-progress`;

// Inlined utilities to avoid external dependencies
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current progress value (0-100) */
  value?: number;
  
  /** Maximum value */
  max?: number;
  
  /** Minimum value */
  min?: number;
  
  /** Visual variant */
  variant?: 'default' | 'success' | 'warning' | 'error';
  
  /** Size of the progress bar */
  size?: 'sm' | 'md' | 'lg';
  
  /** Whether to show progress as indeterminate */
  indeterminate?: boolean;
  
  /** Whether to show percentage label */
  showLabel?: boolean;
  
  /** Custom label text */
  label?: string;
  
  /** Progress bar orientation */
  orientation?: 'horizontal' | 'vertical';
  
  /** Whether progress is animated */
  animated?: boolean;
  
  /** Whether progress is striped */
  striped?: boolean;
}

// Size-based CSS classes
const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return `${l_prx}-sm`;
    case 'lg':
      return `${l_prx}-lg`;
    default:
      return `${l_prx}-md`;
  }
};

// Variant-based CSS classes
const getVariantClasses = (variant: 'default' | 'success' | 'warning' | 'error') => {
  switch (variant) {
    case 'success':
      return `${l_prx}-success`;
    case 'warning':
      return `${l_prx}-warning`;
    case 'error':
      return `${l_prx}-error`;
    default:
      return `${l_prx}-default`;
  }
};

/* @__PURE__ */
const Progress = forwardRef<HTMLDivElement, ProgressProps>(({
  value = 0,
  max = 100,
  min = 0,
  variant = 'default',
  size = 'md',
  indeterminate = false,
  showLabel = false,
  label,
  orientation = 'horizontal',
  animated = false,
  striped = false,
  className = '',
  ...props
}, ref) => {
  // Calculate percentage
  const normalizedValue = Math.max(min, Math.min(max, value));
  const percentage = ((normalizedValue - min) / (max - min)) * 100;
  
  // Generate unique ID for accessibility
  const progressId = `progress-${Math.random().toString(36).substr(2, 9)}`;
  
  // Build CSS classes
  const progressClasses = cn(
    l_prx,
    getSizeClasses(size),
    getVariantClasses(variant),
    orientation === 'vertical' && `${l_prx}-vertical`,
    indeterminate && `${l_prx}-indeterminate`,
    animated && `${l_prx}-animated`,
    striped && `${l_prx}-striped`,
    className
  );
  
  const progressBarClasses = cn(
    `${l_prx}-bar`,
    indeterminate && `${l_prx}-bar-indeterminate`
  );

  return (
    <div className={`${l_prx}-container`}>
      {/* Label */}
      {(showLabel || label) && (
        <div className={`${l_prx}-label`}>
          {label || `${Math.round(percentage)}%`}
        </div>
      )}
      
      {/* Progress Track */}
      <div
        ref={ref}
        className={progressClasses}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : normalizedValue}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-labelledby={label ? `${progressId}-label` : undefined}
        {...props}
      >
        <div
          className={progressBarClasses}
          style={
            indeterminate
              ? undefined
              : orientation === 'vertical'
              ? { height: `${percentage}%` }
              : { width: `${percentage}%` }
          }
        />
      </div>
    </div>
  );
});

Progress.displayName = 'Progress';

export { Progress };