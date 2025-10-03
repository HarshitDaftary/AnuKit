/**
 * AvatarGroup Component
 * Displays a group of avatars with overflow handling
 */

import React from 'react';
import { cn, generateBackgroundColor, generateInitials } from '@optimui/utils';

const lib = "optimui";
const l_prx = `${lib}-avatar-group`;

export interface AvatarGroupUser {
  src?: string;
  name?: string;
  initials?: string;
  alt?: string;
}

export interface AvatarGroupProps {
  users: AvatarGroupUser[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square' | 'rounded';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
  onClick?: (user: AvatarGroupUser, index: number) => void;
  renderOverflow?: (count: number) => React.ReactNode;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  max = 3,
  size = 'md',
  shape = 'circle',
  spacing = 'normal',
  className,
  onClick,
  renderOverflow,
}) => {
  const displayUsers = users.slice(0, max);
  const remainingCount = Math.max(0, users.length - max);

  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
  };
  
  const spacingMap = {
    tight: 0.2,
    normal: 0.3,
    loose: 0.4,
  };

  const avatarSize = sizeMap[size];
  const overlap = avatarSize * spacingMap[spacing];

  const groupClasses = cn(
    `${lib}-avatar-group`,
    `optimui-avatar-group--${size}`,
    `optimui-avatar-group--${spacing}`,
    className
  );

  const handleUserClick = (user: AvatarGroupUser, index: number) => {
    onClick?.(user, index);
  };

  return (
    <div className={groupClasses} style={{ display: 'flex', alignItems: 'center' }}>
      {displayUsers.map((user, index) => (
        <div
          key={index}
          className={cn(
            `${l_prx}-item`,
            `${l_prx}-item--${shape}`,
            {
              [`${l_prx}-item--clickable`]: onClick,
            }
          )}
          style={{
            width: avatarSize,
            height: avatarSize,
            zIndex: displayUsers.length - index,
            marginLeft: index > 0 ? -overlap : 0,
            border: '2px solid white',
            borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? '8px' : '0',
            overflow: 'hidden',
            cursor: onClick ? 'pointer' : 'default',
          }}
          onClick={() => handleUserClick(user, index)}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
        >
          {user.src ? (
            <img
              src={user.src}
              alt={user.alt || user.name || ''}
              className={`${lib}-avatar-group-image`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              className={`${lib}-avatar-group-initials`}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: generateBackgroundColor(user.name || ''),
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${avatarSize * 0.4}px`,
                fontWeight: 600,
              }}
            >
              {user.initials || generateInitials(user.name || '')}
            </div>
          )}
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={cn(
            `${lib}-avatar-group-item`,
            `${lib}-avatar-group-overflow`,
            `optimui-avatar-group-item--${shape}`
          )}
          style={{
            width: avatarSize,
            height: avatarSize,
            marginLeft: -overlap,
            border: '2px solid white',
            borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? '8px' : '0',
            backgroundColor: '#6B7280',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${avatarSize * 0.35}px`,
            fontWeight: 600,
          }}
        >
          {renderOverflow ? renderOverflow(remainingCount) : `+${remainingCount}`}
        </div>
      )}
    </div>
  );
};

AvatarGroup.displayName = 'AvatarGroup';

export { AvatarGroup };