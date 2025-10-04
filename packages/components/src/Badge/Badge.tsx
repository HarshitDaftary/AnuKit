/**
 * Badge Component
 * Display notifications, counts, and status indicators
 */

import React, { forwardRef } from 'react';
import { cn } from '@anukit/utils';
import { encodeSizeMode } from '@anukit/utils';

const lib = "anukit";

const l_prx = `${lib}-badge`;

// Badge configuration
interface BadgeProps {
  /** Badge content (text or number) */
  children?: React.ReactNode;
  
  /** Badge content (alternative to children) */
  content?: React.ReactNode;
  
  /** Numeric count for badges */
  count?: number;
  
  /** Maximum count to display before showing "+" */
  maxCount?: number;
  
  /** Badge variant */
  variant?: 'solid' | 'outline' | 'soft' | 'dot';
  
  /** Badge color theme */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'custom';
  
  /** Custom color (when color is 'custom') */
  customColor?: string;
  
  /** Badge size */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  
  /** Badge positioning */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
  
  /** Element to attach badge to */
  anchor?: React.ReactNode;
  
  /** Hide badge when count is 0 */
  showZero?: boolean;
  
  /** Additional CSS class */
  className?: string;
  
  /** Custom styles */
  style?: React.CSSProperties;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Pulse animation for attention */
  pulse?: boolean;
  
  /** Badge accessibility label */
  'aria-label'?: string;
  
  /** Whether badge is disabled */
  disabled?: boolean;
  
  /** Custom icon for the badge */
  icon?: React.ReactNode;
  
  /** Hide the badge */
  hidden?: boolean;
}

// Get color classes based on variant and color
const getColorClasses = (variant: BadgeProps['variant'], color: BadgeProps['color']) => {
  const baseClass = `anukit-badge-${variant}`;
  const colorClass = `anukit-badge-${color}`;
  
  return {
    base: baseClass,
    color: colorClass,
    combined: `${baseClass}-${color}`,
  };
};

// Format count with max limit
const formatCount = (count: number, maxCount: number = 99): string => {
  if (count <= maxCount) {
    return count.toString();
  }
  return `${maxCount}+`;
};

// Badge component
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({
  children,
  content,
  count,
  maxCount = 99,
  variant = 'solid',
  color = 'primary',
  customColor,
  size = 'md',
  position = 'top-right',
  anchor,
  showZero = false,
  className,
  style,
  onClick,
  pulse = false,
  'aria-label': ariaLabel,
  disabled = false,
  icon,
  hidden = false,
}, ref) => {
  // Determine what to display
  const displayContent = (() => {
    if (variant === 'dot') return null;
    if (typeof count === 'number') {
      if (count === 0 && !showZero) return null;
      return formatCount(count, maxCount);
    }
    return content || children;
  })();
  
  // Hide badge if no content and not a dot
  if (hidden || (variant !== 'dot' && !displayContent && typeof count !== 'number')) {
    return anchor ? <>{anchor}</> : null;
  }
  
  const colorClasses = getColorClasses(variant, color);
  
  const badgeClasses = cn(
    anchor && position !== 'inline' ? `anukit-badge-${position}` : false,
    `${l_prx}-inline`,
    onClick ? `${l_prx}-clickable` : false,
    `${l_prx}-pulse`,
    `${l_prx}-dot`
  );
  
  const badgeStyle = {
    ...style,
    ...(color === 'custom' && customColor && {
      '--badge-custom-color': customColor,
    }),
  };
  
  const badgeElement = (
    <span
      ref={ref}
      className={badgeClasses}
      style={badgeStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={onClick && !disabled ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      aria-label={ariaLabel || (typeof count === 'number' ? `${count} notifications` : undefined)}
    >
      {icon && <span className={`${l_prx}-icon`}>{icon}</span>}
      {displayContent && <span className={`${l_prx}-content`}>{displayContent}</span>}
    </span>
  );
  
  // If there's an anchor element, wrap it with relative positioning
  if (anchor) {
    return (
      <span className={`${l_prx}-wrapper`}>
        {anchor}
        {badgeElement}
      </span>
    );
  }
  
  return badgeElement;
});

// Hook for badge state management
export const useBadgeState = (initialCount: number = 0) => {
  const [count, setCount] = React.useState(initialCount);
  const [visible, setVisible] = React.useState(initialCount > 0);
  
  const increment = React.useCallback((amount: number = 1) => {
    setCount(prev => {
      const newCount = prev + amount;
      setVisible(newCount > 0);
      return newCount;
    });
  }, []);
  
  const decrement = React.useCallback((amount: number = 1) => {
    setCount(prev => {
      const newCount = Math.max(0, prev - amount);
      setVisible(newCount > 0);
      return newCount;
    });
  }, []);
  
  const reset = React.useCallback(() => {
    setCount(0);
    setVisible(false);
  }, []);
  
  const setCountAndVisibility = React.useCallback((newCount: number) => {
    setCount(newCount);
    setVisible(newCount > 0);
  }, []);
  
  return {
    count,
    visible,
    increment,
    decrement,
    reset,
    setCount: setCountAndVisibility,
  };
};

// Notification Badge - specialized component for notifications
export const NotificationBadge: React.FC<Omit<BadgeProps, 'variant' | 'color'> & {
  unread?: boolean;
}> = ({ unread = false, ...props }) => {
  return (
    <Badge
      {...props}
      variant="solid"
      color={unread ? 'error' : 'neutral'}
      pulse={unread}
    />
  );
};

// Status Badge - specialized component for status indicators
export const StatusBadge: React.FC<Omit<BadgeProps, 'variant'> & {
  status?: 'online' | 'offline' | 'away' | 'busy';
}> = ({ status = 'offline', color, ...props }) => {
  const statusColors = {
    online: 'success',
    offline: 'neutral',
    away: 'warning',
    busy: 'error',
  } as const;
  
  return (
    <Badge
      {...props}
      variant="dot"
      color={color || statusColors[status]}
    />
  );
};

// Count Badge - specialized component for counts
export const CountBadge: React.FC<Omit<BadgeProps, 'variant' | 'content' | 'children'> & {
  value: number;
}> = ({ value, ...props }) => {
  return (
    <Badge
      {...props}
      variant="solid"
      count={value}
      showZero={false}
    />
  );
};

Badge.displayName = 'Badge';
NotificationBadge.displayName = 'NotificationBadge';
StatusBadge.displayName = 'StatusBadge';
CountBadge.displayName = 'CountBadge';

export { Badge };
export type { BadgeProps };