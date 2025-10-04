import React, { forwardRef } from 'react';
import { cn } from '@anukit/utils';
import { encodeSizeMode } from '@anukit/utils';

const lib = "anukit";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the card */
  variant?: 'default' | 'outlined' | 'elevated' | 'ghost';
  
  /** Size of the card */
  size?: 'sm' | 'md' | 'lg';
  
  /** Whether card is interactive (clickable) */
  interactive?: boolean;
  
  /** Whether card should take full width */
  fullWidth?: boolean;
  
  /** Card header content */
  header?: React.ReactNode;
  
  /** Card footer content */
  footer?: React.ReactNode;
  
  /** Card image/media content */
  media?: React.ReactNode;
  
  /** Loading state */
  loading?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
}

const l_prx = `${lib}-card`

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
const getVariantClasses = (variant: 'default' | 'outlined' | 'elevated' | 'ghost') => {
  switch (variant) {
    case 'outlined':
      return `${l_prx}-outlined`;
    case 'elevated':
      return `${l_prx}-elevated`;
    case 'ghost':
      return `${l_prx}-ghost`;
    default:
      return `${l_prx}-default`;
  }
};

const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  size = 'md',
  interactive = false,
  fullWidth = false,
  header,
  footer,
  media,
  loading = false,
  disabled = false,
  children,
  className = '',
  onClick,
  ...props
}, ref) => {
  // Build CSS classes
  const cardClasses = cn(
    l_prx,
    getSizeClasses(size),
    getVariantClasses(variant),
    `${l_prx}-${encodeSizeMode(size)}`,
    interactive && `${l_prx}-interactive`,
    fullWidth && `${l_prx}-full-width`,
    loading && `${l_prx}-loading`,
    disabled && `${l_prx}-disabled`,
    className
  );

  return (
    <div
      ref={ref}
      className={cardClasses}
      onClick={disabled ? undefined : onClick}
      tabIndex={interactive && !disabled ? 0 : undefined}
      role={interactive && onClick ? 'button' : undefined}
      aria-disabled={disabled}
      {...props}
    >
      {loading && (
        <div className={`${l_prx}-loading-overlay`}>
          <div className={`${l_prx}-spinner`} aria-label="Loading" />
        </div>
      )}
      
      {media && (
        <div className={`${l_prx}-media`}>
          {media}
        </div>
      )}
      
      {header && (
        <div className={`${l_prx}-header`}>
          {header}
        </div>
      )}
      
      {children && (
        <div className={`${l_prx}-content`}>
          {children}
        </div>
      )}
      
      {footer && (
        <div className={`${l_prx}-footer`}>
          {footer}
        </div>
      )}
    </div>
  );
});

Card.displayName = 'Card';

export { Card };