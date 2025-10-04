/**
 * Avatar Component
 * Display user profile pictures, initials, and status indicators
 */

import React, { forwardRef, useState, useCallback, useMemo } from 'react';
import { cn } from '@optimui/utils';

const lib = "optimui";

const l_prx = `${lib}-avatar`;

// Avatar configuration
interface AvatarProps {
  /** Image source URL */
  src?: string;
  
  /** Alt text for the image */
  alt?: string;
  
  /** Name for generating initials */
  name?: string;
  
  /** Avatar size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  
  /** Avatar shape */
  shape?: 'circle' | 'square' | 'rounded';
  
  /** Custom initials (overrides name-based generation) */
  initials?: string;
  
  /** Fallback icon when no image or name */
  fallbackIcon?: React.ReactNode;
  
  /** Status indicator */
  status?: {
    type: 'online' | 'offline' | 'away' | 'busy' | 'custom';
    color?: string;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    size?: 'sm' | 'md' | 'lg';
  };
  
  /** Badge content (number or text) */
  badge?: {
    content: string | number;
    color?: string;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    variant?: 'solid' | 'outline';
  };
  
  /** Additional CSS class */
  className?: string;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Custom background color */
  backgroundColor?: string;
  
  /** Custom text color */
  textColor?: string;
  
  /** Loading state */
  loading?: boolean;
  
  /** Custom loading indicator */
  loadingIndicator?: React.ReactNode;
  
  /** Image loading strategy */
  loadingStrategy?: 'eager' | 'lazy';
  
  /** Image error handler */
  onImageError?: () => void;
  
  /** Image load handler */
  onImageLoad?: () => void;
  
  /** Group avatar configuration */
  group?: {
    users: Array<{
      src?: string;
      name?: string;
      initials?: string;
    }>;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
  };
}

// Generate initials from name
const generateInitials = (name: string, maxLength: number = 2): string => {
  if (!name) return '';
  
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, maxLength).toUpperCase();
  }
  
  return words
    .slice(0, maxLength)
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

// Generate background color from name
const generateBackgroundColor = (name: string): string => {
  if (!name) return '#6B7280';
  
  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Get size value in pixels
const getSizeValue = (size: AvatarProps['size']): number => {
  if (typeof size === 'number') return size;
  
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
    '2xl': 64,
  };
  
  return sizeMap[size || 'md'];
};

// Status indicator component
const StatusIndicator: React.FC<{
  status: AvatarProps['status'];
  avatarSize: number;
}> = ({ status, avatarSize }) => {
  if (!status) return null;
  
  const statusColors = {
    online: '#10B981',
    offline: '#6B7280',
    away: '#F59E0B',
    busy: '#EF4444',
    custom: status.color || '#6B7280',
  };
  
  const statusSizes = {
    sm: Math.max(8, avatarSize * 0.2),
    md: Math.max(10, avatarSize * 0.25),
    lg: Math.max(12, avatarSize * 0.3),
  };
  
  const indicatorSize = statusSizes[status.size || 'md'];
  const color = statusColors[status.type];
  
  const positionClasses = {
    'top-right': `${lib}-avatar-status-top-right`,
    'top-left': `${lib}-avatar-status-top-left`,
    'bottom-right': `${lib}-avatar-status-bottom-right`,
    'bottom-left': `${lib}-avatar-status-bottom-left`,
  };
  
  return (
    <div
      className={cn(
        `${lib}-avatar-status`,
        positionClasses[status.position || 'bottom-right']
      )}
      style={{
        width: indicatorSize,
        height: indicatorSize,
        backgroundColor: color,
      }}
    />
  );
};

// Badge component
const Badge: React.FC<{
  badge: AvatarProps['badge'];
  avatarSize: number;
}> = ({ badge, avatarSize }) => {
  if (!badge) return null;
  
  const positionClasses = {
    'top-right': `${lib}-avatar-badge-top-right`,
    'top-left': `${lib}-avatar-badge-top-left`,
    'bottom-right': `${lib}-avatar-badge-bottom-right`,
    'bottom-left': `${lib}-avatar-badge-bottom-left`,
  };
  
  const badgeSize = Math.max(16, avatarSize * 0.4);
  const fontSize = Math.max(10, badgeSize * 0.6);
  
  return (
    <div
      className={cn(
        `${lib}-avatar-badge`,
        `optimui-avatar-badge-${badge.variant || 'solid'}`,
        positionClasses[badge.position || 'top-right']
      )}
      style={{
        minWidth: badgeSize,
        height: badgeSize,
        fontSize,
        backgroundColor: badge.variant === 'outline' ? 'transparent' : (badge.color || '#EF4444'),
        borderColor: badge.color || '#EF4444',
        color: badge.variant === 'outline' ? (badge.color || '#EF4444') : 'white',
      }}
    >
      {badge.content}
    </div>
  );
};

// Group avatar component
const GroupAvatar: React.FC<{
  group: NonNullable<AvatarProps['group']>;
  size: number;
  shape: AvatarProps['shape'];
  className?: string;
}> = ({ group, size, shape = 'circle', className }) => {
  const { users, max = 3 } = group;
  const displayUsers = users.slice(0, max);
  const remainingCount = Math.max(0, users.length - max);
  
  const groupSize = group.size || 'md';
  const sizeMap = {
    sm: size * 0.7,
    md: size * 0.8,
    lg: size * 0.9,
  };
  const individualSize = sizeMap[groupSize];
  
  return (
    <div className={cn(`${lib}-avatar-group`, className)}>
      {displayUsers.map((user, index) => (
        <div
          key={index}
          className={cn(
            `${lib}-avatar-group-item`,
            `optimui-avatar-${shape}`
          )}
          style={{
            width: individualSize,
            height: individualSize,
            zIndex: displayUsers.length - index,
            marginLeft: index > 0 ? -individualSize * 0.3 : 0,
          }}
        >
          {user.src ? (
            <img
              src={user.src}
              alt={user.name || ''}
              className={`${lib}-avatar-image`}
            />
          ) : (
            <div
              className={`${lib}-avatar-initials`}
              style={{
                backgroundColor: generateBackgroundColor(user.name || ''),
                fontSize: individualSize * 0.4,
              }}
            >
              {user.initials || generateInitials(user.name || '', 1)}
            </div>
          )}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div
          className={cn(
            `${lib}-avatar-group-item`,
            `${lib}-avatar-group-remaining`,
            `optimui-avatar-${shape}`
          )}
          style={{
            width: individualSize,
            height: individualSize,
            marginLeft: -individualSize * 0.3,
            fontSize: individualSize * 0.3,
          }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

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
  className,
  onClick,
  backgroundColor,
  textColor,
  loading = false,
  loadingIndicator,
  loadingStrategy = 'lazy',
  onImageError,
  onImageLoad,
  group,
}, ref) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const sizeValue = getSizeValue(size);
  const displayInitials = initials || generateInitials(name);
  const bgColor = backgroundColor || generateBackgroundColor(name);
  
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
    onImageError?.();
  }, [onImageError]);
  
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    onImageLoad?.();
  }, [onImageLoad]);
  
  // Render group avatar
  if (group) {
    return (
      <GroupAvatar
        group={group}
        size={sizeValue}
        shape={shape}
        className={className}
      />
    );
  }
  
  const containerClasses = cn(
    l_prx,
    `${l_prx}-${shape}`,
    `${l_prx}-${size}`,
    onClick && `${l_prx}-clickable`,
    (loading || imageLoading) && `${l_prx}-loading`,
    className
  );
  
  const containerStyle = {
    width: sizeValue,
    height: sizeValue,
  };
  
  const renderContent = useMemo(() => {
    if (loading) {
      return (
        <div className={`${lib}-avatar-loading-container`}>
          {loadingIndicator || (
            <div className={`${lib}-avatar-loading-spinner`} />
          )}
        </div>
      );
    }
    
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt || name}
          className={`${lib}-avatar-image`}
          loading={loadingStrategy}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{
            display: imageLoading ? 'none' : 'block',
          }}
        />
      );
    }
    
    if (displayInitials) {
      return (
        <div
          className={`${lib}-avatar-initials`}
          style={{
            backgroundColor: bgColor,
            color: textColor || 'white',
            fontSize: sizeValue * 0.4,
          }}
        >
          {displayInitials}
        </div>
      );
    }
    
    if (fallbackIcon) {
      return (
        <div
          className={`${lib}-avatar-fallback`}
          style={{
            backgroundColor: bgColor,
            color: textColor || 'white',
          }}
        >
          {fallbackIcon}
        </div>
      );
    }
    
    return (
      <div
        className={`${lib}-avatar-fallback`}
        style={{
          backgroundColor: bgColor,
          color: textColor || 'white',
        }}
      >
        <svg
          width={sizeValue * 0.6}
          height={sizeValue * 0.6}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
    );
  }, [
    loading,
    loadingIndicator,
    src,
    imageError,
    alt,
    name,
    loadingStrategy,
    handleImageError,
    handleImageLoad,
    imageLoading,
    displayInitials,
    bgColor,
    textColor,
    sizeValue,
    fallbackIcon,
  ]);
  
  return (
    <div
      ref={ref}
      className={containerClasses}
      style={containerStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {renderContent}
      
      {/* Loading overlay for image */}
      {src && !imageError && imageLoading && (
        <div className={`${lib}-avatar-loading-overlay`}>
          {loadingIndicator || (
            <div className={`${lib}-avatar-loading-spinner`} />
          )}
        </div>
      )}
      
      <StatusIndicator status={status} avatarSize={sizeValue} />
      <Badge badge={badge} avatarSize={sizeValue} />
    </div>
  );
});

// Hook for avatar state management
export const useAvatarState = (src?: string) => {
  const [loading, setLoading] = useState(!!src);
  const [error, setError] = useState(false);
  
  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(false);
  }, []);
  
  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);
  
  const retry = useCallback(() => {
    if (src) {
      setLoading(true);
      setError(false);
    }
  }, [src]);
  
  return {
    loading,
    error,
    handleLoad,
    handleError,
    retry,
  };
};

Avatar.displayName = 'Avatar';

export { Avatar };
export type { AvatarProps };