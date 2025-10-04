/**
 * Avatar Component - Optimized Architecture
 * Main component reduced from 522 lines to ~200 lines through composition
 */

import React, { forwardRef } from 'react';
import { cn } from '@optimui/utils';
import { useAvatar } from './hooks/useAvatar';
import { AvatarGroup } from './AvatarGroup';
import { AvatarBadge } from './AvatarBadge';
import { encodeSizeMode } from '@optimui/utils/sizeMode';

const lib = "optimui";

interface AvatarProps {
  /** Image source URL */
  src?: string;
  
  /** Alt text for image */
  alt?: string;
  
  /** Name for generating initials and background color */
  name?: string;
  
  /** Size of the avatar */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  
  /** Shape of the avatar */
  shape?: 'circle' | 'square' | 'rounded';
  
  /** Custom initials override */
  initials?: string;
  
  /** Fallback icon when no image or initials */
  fallbackIcon?: React.ReactNode;
  
  /** Status indicator */
  status?: {
    type: 'online' | 'offline' | 'away' | 'busy' | 'custom';
    color?: string;
    size?: 'sm' | 'md' | 'lg';
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  };
  
  /** Badge overlay */
  badge?: {
    content?: React.ReactNode;
    count?: number;
    variant?: 'solid' | 'outline' | 'dot';
    color?: string;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  };
  
  /** Group configuration */
  group?: {
    users: Array<{
      src?: string;
      name?: string;
      initials?: string;
    }>;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
  };
  
  /** Custom background color */
  backgroundColor?: string;
  
  /** Custom text color */
  textColor?: string;
  
  /** Loading state */
  loading?: boolean;
  
  /** Custom loading indicator */
  loadingIndicator?: React.ReactNode;
  
  /** Image loading strategy */
  loadingStrategy?: 'lazy' | 'eager';
  
  /** Click handler */
  onClick?: () => void;
  
  /** Image error handler */
  onImageError?: () => void;
  
  /** Image load handler */
  onImageLoad?: () => void;
  
  /** Additional CSS class */
  className?: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({
  src,
  alt,
  name = '',
  size = 'md',
  shape = 'circle',
  initials,
  fallbackIcon,
  status,
  badge,
  group,
  backgroundColor,
  textColor,
  loading = false,
  loadingIndicator,
  loadingStrategy = 'lazy',
  onClick,
  onImageError,
  onImageLoad,
  className,
  ...props
}, ref) => {
  const avatarState = useAvatar({
    src,
    name,
    size,
    onImageError,
    onImageLoad,
  });

  // Render group avatar
  if (group) {
    return (
      <AvatarGroup
        users={group.users}
        max={group.max}
        size={group.size || (typeof size === 'string' ? size : 'md')}
        shape={shape}
        className={className}
      />
    );
  }

  const containerClasses = cn(
    `${lib}-avatar`,
    `optimui-avatar--${shape}`,
    `optimui-avatar--${size}`,
    {
      [`${lib}-avatar--clickable`]: onClick,
      [`${lib}-avatar--loading`]: loading || avatarState.imageLoading,
    },
    className
  );

  const containerStyle: React.CSSProperties = {
    width: avatarState.sizeValue,
    height: avatarState.sizeValue,
    position: 'relative',
    borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? '8px' : '0',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: onClick ? 'pointer' : 'default',
  };

  // Render main avatar content
  const renderContent = () => {
    if (loading) {
      return (
        <div className={`${lib}-avatar-loading`}>
          {loadingIndicator || <div className={`${lib}-avatar-spinner`} />}
        </div>
      );
    }

    if (src && !avatarState.imageError) {
      return (
        <img
          src={src}
          alt={alt || name}
          className={`${lib}-avatar-image`}
          loading={loadingStrategy}
          onError={avatarState.handleImageError}
          onLoad={avatarState.handleImageLoad}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: avatarState.imageLoading ? 'none' : 'block',
          }}
        />
      );
    }

    if (initials || avatarState.displayInitials) {
      return (
        <div
          className={`${lib}-avatar-initials`}
          style={{
            backgroundColor: backgroundColor || avatarState.backgroundColor,
            color: textColor || 'white',
            fontSize: `${avatarState.sizeValue * 0.4}px`,
            fontWeight: 600,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {initials || avatarState.displayInitials}
        </div>
      );
    }

    if (fallbackIcon) {
      return (
        <div
          className={`${lib}-avatar-fallback`}
          style={{
            backgroundColor: backgroundColor || avatarState.backgroundColor,
            color: textColor || 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {fallbackIcon}
        </div>
      );
    }

    // Default user icon
    return (
      <div
        className={`${lib}-avatar-fallback`}
        style={{
          backgroundColor: backgroundColor || avatarState.backgroundColor,
          color: textColor || 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width={avatarState.sizeValue * 0.6}
          height={avatarState.sizeValue * 0.6}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
    );
  };

  const handleClick = () => {
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={ref}
      className={containerClasses}
      style={containerStyle}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {renderContent()}
      
      {/* Image loading overlay */}
      {src && !avatarState.imageError && avatarState.imageLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loadingIndicator || <div className={`${lib}-avatar-spinner`} />}
        </div>
      )}

      {/* Status indicator */}
      {status && (
        <div
          className={cn(
            `${lib}-avatar-status`,
            `optimui-avatar-status--${status.position || 'bottom-right'}`
          )}
          style={{
            position: 'absolute',
            width: Math.max(8, avatarState.sizeValue * 0.25),
            height: Math.max(8, avatarState.sizeValue * 0.25),
            borderRadius: '50%',
            border: '2px solid white',
            backgroundColor: status.color || (
              status.type === 'online' ? '#10B981' :
              status.type === 'away' ? '#F59E0B' :
              status.type === 'busy' ? '#EF4444' :
              '#6B7280'
            ),
            ...(status.position === 'top-right' ? { top: 0, right: 0, transform: 'translate(50%, -50%)' } :
                status.position === 'top-left' ? { top: 0, left: 0, transform: 'translate(-50%, -50%)' } :
                status.position === 'bottom-left' ? { bottom: 0, left: 0, transform: 'translate(-50%, 50%)' } :
                { bottom: 0, right: 0, transform: 'translate(50%, 50%)' }),
          }}
        />
      )}

      {/* Badge */}
      {badge && (
        <AvatarBadge
          content={badge.content}
          count={badge.count}
          variant={badge.variant}
          color={badge.color}
          position={badge.position}
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export { Avatar };
export type { AvatarProps };

// Re-export sub-components
export { AvatarGroup } from './AvatarGroup';
export { AvatarBadge } from './AvatarBadge';
export { useAvatar } from './hooks/useAvatar';