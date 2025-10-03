import React, { forwardRef } from 'react';
import { encodeSizeMode } from '@optimui/utils/sizeMode';

const lib = "optimui";
const l_prx = `${lib}-breadcrumb`;

// Inlined utilities to avoid external dependencies
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
  onClick?: () => void;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** Breadcrumb items */
  items: BreadcrumbItem[];
  
  /** Custom separator element */
  separator?: React.ReactNode;
  
  /** Size of the breadcrumb */
  size?: 'sm' | 'md' | 'lg';
  
  /** Maximum items to show before collapse */
  maxItems?: number;
  
  /** Whether to show home icon for first item */
  showHomeIcon?: boolean;
  
  /** Custom home icon */
  homeIcon?: React.ReactNode;
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

// Default separator
const DefaultSeparator = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M4.5 3L7.5 6L4.5 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Default home icon
const DefaultHomeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M2 6L8 1.5L14 6V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 14V10H10V14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* @__PURE__ */
const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(({
  items,
  separator,
  size = 'md',
  maxItems,
  showHomeIcon = false,
  homeIcon,
  className = '',
  ...props
}, ref) => {
  // Process items for collapse functionality
  const processedItems = (() => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    const firstItem = items[0];
    const lastItems = items.slice(-maxItems + 2);
    
    return [
      firstItem,
      {
        id: 'collapsed',
        label: '...',
        onClick: () => {}, // Could expand or show tooltip
      },
      ...lastItems,
    ];
  })();

  // Render breadcrumb item
  const renderItem = (item: BreadcrumbItem, index: number) => {
    const isLast = index === processedItems.length - 1;
    const isCurrent = item.current || isLast;
    const isCollapsed = item.id === 'collapsed';
    
    const ItemComponent = item.href && !isCurrent ? 'a' : 'span';
    
    const itemContent = (
      <>
        {/* Home icon for first item */}
        {index === 0 && showHomeIcon && (
          <span className={`${l_prx}-home-icon`}>
            {homeIcon || <DefaultHomeIcon />}
          </span>
        )}
        
        {/* Item icon */}
        {item.icon && (
          <span className={`${l_prx}-item-icon`}>
            {item.icon}
          </span>
        )}
        
        {/* Item label */}
        <span className={`${l_prx}-item-label`}>
          {item.label}
        </span>
      </>
    );

    return (
      <li key={item.id} className={`${l_prx}-item`}>
        <ItemComponent
          className={cn(
            `${l_prx}-link`,
            isCurrent && `${l_prx}-current`,
            isCollapsed && `${l_prx}-collapsed`
          )}
          href={item.href}
          onClick={item.onClick}
          aria-current={isCurrent ? 'page' : undefined}
          tabIndex={isCollapsed ? -1 : undefined}
          title={isCollapsed ? 'Show more items' : item.label}
        >
          {itemContent}
        </ItemComponent>
        
        {/* Separator */}
        {!isLast && (
          <span 
            className={`${l_prx}-separator`}
            aria-hidden="true"
          >
            {separator || <DefaultSeparator />}
          </span>
        )}
      </li>
    );
  };

  // Build CSS classes
  const breadcrumbClasses = cn(
    l_prx,
    getSizeClasses(size),
    className
  );

  return (
    <nav
      ref={ref}
      className={breadcrumbClasses}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className={`${l_prx}-list`} role="list">
        {processedItems.map((item, index) => renderItem(item, index))}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

export { Breadcrumb };