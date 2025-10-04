/**
 * AvatarBadge Component
 * Badge overlay for Avatar with customizable positioning and styling
 */

import React from 'react';
import { cn } from '@anukit/utils';

const lib = "anukit";

export interface AvatarBadgeProps {
  content?: React.ReactNode;
  count?: number;
  variant?: 'solid' | 'outline' | 'dot';
  color?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showZero?: boolean;
  maxCount?: number;
}

const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  content,
  count,
  variant = 'solid',
  color = '#EF4444',
  position = 'top-right',
  size = 'md',
  className,
  showZero = false,
  maxCount = 99,
}) => {
  // Determine display content
  let displayContent: React.ReactNode = content;
  
  if (typeof count === 'number') {
    if (count === 0 && !showZero) {
      return null;
    }
    
    if (count > maxCount) {
      displayContent = `${maxCount}+`;
    } else {
      displayContent = count;
    }
  }

  // Hide if no content
  if (!displayContent && variant !== 'dot') {
    return null;
  }

  const sizeMap = {
    sm: { width: 16, height: 16, fontSize: 10 },
    md: { width: 20, height: 20, fontSize: 12 },
    lg: { width: 24, height: 24, fontSize: 14 },
  };

  const positionMap = {
    'top-right': { top: 0, right: 0, transform: 'translate(50%, -50%)' },
    'top-left': { top: 0, left: 0, transform: 'translate(-50%, -50%)' },
    'bottom-right': { bottom: 0, right: 0, transform: 'translate(50%, 50%)' },
    'bottom-left': { bottom: 0, left: 0, transform: 'translate(-50%, 50%)' },
  };

  const badgeSize = sizeMap[size];
  const badgePosition = positionMap[position];

  const badgeClasses = cn(
    `${lib}-avatar-badge`,
    `anukit-avatar-badge--${variant}`,
    `anukit-avatar-badge--${size}`,
    `anukit-avatar-badge--${position}`,
    className
  );

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: variant === 'dot' ? badgeSize.width / 2 : badgeSize.width,
    height: variant === 'dot' ? badgeSize.height / 2 : badgeSize.height,
    fontSize: badgeSize.fontSize,
    fontWeight: 600,
    borderRadius: '50%',
    border: '2px solid white',
    color: variant === 'outline' ? color : 'white',
    backgroundColor: variant === 'outline' ? 'transparent' : color,
    borderColor: variant === 'outline' ? color : 'white',
    zIndex: 10,
    ...badgePosition,
  };

  // For dot variant, make it circular
  if (variant === 'dot') {
    badgeStyle.padding = 0;
    badgeStyle.minWidth = badgeSize.width / 2;
    badgeStyle.width = badgeSize.width / 2;
  } else if (displayContent && String(displayContent).length > 2) {
    // Adjust width for longer content
    badgeStyle.minWidth = badgeSize.width * 1.2;
    badgeStyle.borderRadius = `${badgeSize.height / 2}px`;
  }

  return (
    <div className={badgeClasses} style={badgeStyle}>
      {variant !== 'dot' && displayContent}
    </div>
  );
};

AvatarBadge.displayName = 'AvatarBadge';

export { AvatarBadge };