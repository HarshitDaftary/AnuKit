/**
 * Spinner Component
 * Loading indicators and progress spinners
 */

import React, { forwardRef, useEffect, useState } from 'react';
import { cn } from '@optimui/utils';
import { encodeSizeMode as enc } from '@optimui/utils/sizeMode';

const lib = "optimui";

const l_prx = `${lib}-spinner`;

export interface SpinnerProps {
  /** Spinner size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  
  /** Spinner color */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'white' | 'current' | 'custom';
  
  /** Custom color value */
  customColor?: string;
  
  /** Spinner variant */
  variant?: 'circular' | 'dots' | 'bars' | 'pulse' | 'ring';
  
  /** Loading text */
  label?: string;
  
  /** Hide the label visually but keep it for screen readers */
  labelHidden?: boolean;
  
  /** Text position relative to spinner */
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  
  /** Additional CSS class */
  className?: string;
  
  /** Custom styles */
  style?: React.CSSProperties;
  
  /** Animation speed */
  speed?: 'slow' | 'normal' | 'fast';
  
  /** Whether spinner should be centered */
  center?: boolean;
  
  /** Full overlay mode */
  overlay?: boolean;
  
  /** Overlay background */
  overlayBackground?: string;
  
  /** Track color for ring variant */
  trackColor?: string;
}

// Get size value in pixels
const getSizeValue = (size: SpinnerProps['size']): number => {
  if (typeof size === 'number') return size;
  
  const sizeMap = {
    [enc('xs')]: 16,
    [enc('sm')]: 20,
    [enc('md')]: 24,
    [enc('lg')]: 32,
    [enc('xl')]: 40,
  };
  
  return sizeMap[size || 'md'];
};

// Circular spinner variant
const CircularSpinner: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="31.416"
      strokeDashoffset="31.416"
    />
  </svg>
);

// Dots spinner variant
const DotsSpinner: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <div className={className} style={{ width: size, height: size / 3 }}>
    <div className={`${l_prx}-dot`} />
    <div className={`${l_prx}-dot`} />
    <div className={`${l_prx}-dot`} />
  </div>
);

// Bars spinner variant
const BarsSpinner: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <div className={className} style={{ width: size, height: size }}>
    <div className={`${l_prx}-bar`} />
    <div className={`${l_prx}-bar`} />
    <div className={`${l_prx}-bar`} />
    <div className={`${l_prx}-bar`} />
    <div className={`${l_prx}-bar`} />
  </div>
);

// Pulse spinner variant
const PulseSpinner: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <div
    className={className}
    style={{ width: size, height: size }}
  />
);

// Ring spinner variant
const RingSpinner: React.FC<{ size: number; className: string; trackColor?: string }> = ({ 
  size, 
  className,
  trackColor = 'rgba(0, 0, 0, 0.1)'
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={trackColor}
      strokeWidth="2"
      className={`${l_prx}-track`}
    />
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="31.416"
      strokeDashoffset="7.854"
      className={`${l_prx}-progress`}
    />
  </svg>
);

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(({
  size = 'md',
  color = 'primary',
  customColor,
  variant = 'circular',
  label,
  labelHidden = false,
  labelPosition = 'bottom',
  className,
  style,
  speed = 'normal',
  center = false,
  overlay = false,
  overlayBackground = 'rgba(255, 255, 255, 0.8)',
  trackColor,
}, ref) => {
  const sizeValue = getSizeValue(size);
  
  const spinnerClasses = cn(
    l_prx,
    `${l_prx}-${variant}`,
    `${l_prx}-${color}`,
    `${l_prx}-${speed}`,
    {
      [`${l_prx}--center`]: center,
      [`${l_prx}--overlay`]: overlay,
      [`${l_prx}-label-${labelPosition}`]: label && !labelHidden,
    },
    className
  );
  
  const spinnerStyle = {
    ...style,
    ...(customColor && color === 'custom' && {
      '--spinner-color': customColor,
    }),
    ...(overlay && {
      '--overlay-background': overlayBackground,
    }),
  };
  
  const renderSpinner = () => {
    const spinnerElementClass = `optimui-spinner-element optimui-spinner-${variant}-element`;
    
    switch (variant) {
      case 'dots':
        return <DotsSpinner size={sizeValue} className={spinnerElementClass} />;
      case 'bars':
        return <BarsSpinner size={sizeValue} className={spinnerElementClass} />;
      case 'pulse':
        return <PulseSpinner size={sizeValue} className={spinnerElementClass} />;
      case 'ring':
        return <RingSpinner size={sizeValue} className={spinnerElementClass} trackColor={trackColor} />;
      case 'circular':
      default:
        return <CircularSpinner size={sizeValue} className={spinnerElementClass} />;
    }
  };
  
  const content = (
    <div ref={ref} className={spinnerClasses} style={spinnerStyle}>
      {renderSpinner()}
      {label && (
        <span
          className={cn(`${l_prx}-label`, {
            [`${l_prx}-label--hidden`]: labelHidden,
          })}
        >
          {label}
        </span>
      )}
    </div>
  );
  
  if (overlay) {
    return (
      <div className={`${l_prx}-overlay-container`}>
        {content}
      </div>
    );
  }
  
  return content;
});

// Loading wrapper component
export interface LoadingProps {
  /** Whether to show loading state */
  loading: boolean;
  
  /** Content to show when not loading */
  children: React.ReactNode;
  
  /** Spinner props */
  spinnerProps?: Omit<SpinnerProps, 'overlay'>;
  
  /** Loading text */
  text?: string;
  
  /** Minimum loading time in ms */
  delay?: number;
}

export const Loading: React.FC<LoadingProps> = ({
  loading,
  children,
  spinnerProps = {},
  text = 'Loading...',
  delay = 0,
}) => {
  const [showSpinner, setShowSpinner] = React.useState(loading && delay === 0);
  
  React.useEffect(() => {
    if (loading && delay > 0) {
      const timer = setTimeout(() => {
        setShowSpinner(true);
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      setShowSpinner(loading);
    }
  }, [loading, delay]);
  
  if (showSpinner) {
    return (
      <div className={`${lib}-loading-container`}>
        <Spinner
          {...spinnerProps}
          label={text}
          center
          overlay
        />
      </div>
    );
  }
  
  return <>{children}</>;
};

// Hook for loading states
export const useLoading = (initialLoading: boolean = false) => {
  const [loading, setLoading] = React.useState(initialLoading);
  
  const startLoading = React.useCallback(() => {
    setLoading(true);
  }, []);
  
  const stopLoading = React.useCallback(() => {
    setLoading(false);
  }, []);
  
  const withLoading = React.useCallback(async <T,>(
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    setLoading(true);
    try {
      return await asyncFn();
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    startLoading,
    stopLoading,
    withLoading,
    setLoading,
  };
};

Spinner.displayName = 'Spinner';
Loading.displayName = 'Loading';

export { Spinner };
export type { SpinnerProps };