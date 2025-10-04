/**
 * ListItem Component
 * Individual list item with content structure
 * Lightweight component for basic list items
 */

import React, { forwardRef } from 'react';
import { cn } from '@anukit/utils';

const lib = "anukit";
const l_prx = `${lib}-list`;

// List item icon
export const ListItemIcon: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn(`${l_prx}-item-icon`, className)}>
    {children}
  </div>
);

// List item text
export const ListItemText: React.FC<{
  primary?: React.ReactNode;
  secondary?: React.ReactNode;
  className?: string;
}> = ({ primary, secondary, className }) => (
  <div className={cn(`${l_prx}-item-text`, className)}>
    {primary && (
      <div className={`${l_prx}-item-primary`}>
        {primary}
      </div>
    )}
    {secondary && (
      <div className={`${l_prx}-item-secondary`}>
        {secondary}
      </div>
    )}
  </div>
);

// List item configuration
interface ListItemProps {
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
  
  /** Additional CSS class */
  className?: string;
  
  /** Divider after this item */
  divider?: boolean;
  
  /** Dense mode (smaller padding) */
  dense?: boolean;
  
  /** Indent level for nested items */
  indent?: number;
}

const ListItem = /* @__PURE__ */ forwardRef<HTMLLIElement, ListItemProps>(({
  children,
  icon,
  primary,
  secondary,
  trailing,
  disabled = false,
  selected = false,
  className,
  divider = false,
  dense = false,
  indent = 0,
  ...props
}, ref) => {
  const classes = cn(
    `${l_prx}-item`,
    disabled && `${l_prx}-item--disabled`,
    selected && `${l_prx}-item--selected`,
    divider && `${l_prx}-item--divider`,
    dense && `${l_prx}-item--dense`,
    className
  );
  
  const style = {
    paddingLeft: indent ? `${24 + indent * 16}px` : undefined,
  };
  
  const content = (
    <>
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
    </>
  );
  
  return (
    <li ref={ref} className={classes} style={style} {...props}>
      {content}
    </li>
  );
});

ListItem.displayName = 'ListItem';

export { ListItem, type ListItemProps };