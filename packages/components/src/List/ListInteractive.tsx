/**
 * ListInteractive Components
 * Interactive list items with button functionality
 * Separated to reduce bundle size when interactivity isn't needed
 */

import React, { forwardRef } from 'react';
import { cn } from '@anukit/utils';
import { ListItemIcon, ListItemText } from './ListItem';

const lib = "anukit";
const l_prx = `${lib}-list`;

// Interactive list item configuration
interface ListItemButtonProps {
  /** List item content */
  children?: React.ReactNode;
  
  /** Leading icon */
  icon?: React.ReactNode;
  
  /** Primary text */
  primary?: React.ReactNode;
  
  /** Secondary text */
  secondary?: React.ReactNode;
  
  /** Trailing element (icon, button, etc.) */
  trailing?: React.ReactNode;
  
  /** Whether item is disabled */
  disabled?: boolean;
  
  /** Whether item is selected */
  selected?: boolean;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Additional CSS class */
  className?: string;
  
  /** Divider after this item */
  divider?: boolean;
  
  /** Dense mode (smaller padding) */
  dense?: boolean;
  
  /** Indent level for nested items */
  indent?: number;
}

// List item button
export const ListItemButton = /* @__PURE__ */ forwardRef<HTMLButtonElement, ListItemButtonProps>(({
  children,
  icon,
  primary,
  secondary,
  trailing,
  disabled = false,
  selected = false,
  onClick,
  className,
  divider = false,
  dense = false,
  indent = 0,
  ...props
}, ref) => {
  const classes = cn(
    `${l_prx}-item`,
    `${l_prx}-item-button`,
    disabled && `${l_prx}-item--disabled`,
    selected && `${l_prx}-item--selected`,
    divider && `${l_prx}-item--divider`,
    dense && `${l_prx}-item--dense`,
    className
  );
  
  const style = {
    paddingLeft: indent ? `${24 + indent * 16}px` : undefined,
  };
  
  return (
    <button
      ref={ref}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      style={style}
      {...props}
    >
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      
      {(primary || secondary) ? (
        <ListItemText primary={primary} secondary={secondary} />
      ) : (
        <div className={`${l_prx}-item-content`}>
          {children}
        </div>
      )}
      
      {trailing && (
        <div className={`${l_prx}-item-trailing`}>
          {trailing}
        </div>
      )}
    </button>
  );
});

ListItemButton.displayName = 'ListItemButton';

// List subheader
export const ListSubheader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn(`${l_prx}-subheader`, className)}>
    {children}
  </div>
);

export { type ListItemButtonProps };