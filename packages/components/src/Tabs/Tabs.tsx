import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { encodeSizeMode } from '@anukit/utils';

const lib = "anukit";

const l_prx = `${lib}-tabs`;

// Inlined utilities to avoid external dependencies
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface TabItem {
  id: string;
  label: string;
  content?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Array of tab items */
  items: TabItem[];
  
  /** Currently active tab ID */
  activeTab?: string;
  
  /** Default active tab (uncontrolled) */
  defaultActiveTab?: string;
  
  /** Callback when tab changes */
  onChange?: (tabId: string) => void;
  
  /** Visual variant */
  variant?: 'default' | 'pills' | 'underline';
  
  /** Size of the tabs */
  size?: 'sm' | 'md' | 'lg';
  
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  
  /** Whether tabs should fill available width */
  fullWidth?: boolean;
  
  /** Whether content should be rendered lazily */
  lazyContent?: boolean;
  
  /** Whether to keep content mounted when inactive */
  keepContentMounted?: boolean;
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

// Variant-based CSS classes
const getVariantClasses = (variant: 'default' | 'pills' | 'underline') => {
  switch (variant) {
    case 'pills':
      return `${l_prx}-pills`;
    case 'underline':
      return `${l_prx}-underline`;
    default:
      return `${l_prx}-default`;
  }
};

/* @__PURE__ */
const Tabs = forwardRef<HTMLDivElement, TabsProps>(({
  items,
  activeTab,
  defaultActiveTab,
  onChange,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  fullWidth = false,
  lazyContent = false,
  keepContentMounted = false,
  className = '',
  ...props
}, ref) => {
  // State management for uncontrolled tabs
  const [internalActiveTab, setInternalActiveTab] = useState(() => {
    return defaultActiveTab || items[0]?.id || '';
  });
  
  // Track which tabs have been rendered (for lazy loading)
  const [renderedTabs, setRenderedTabs] = useState(new Set([internalActiveTab]));
  
  const isControlled = activeTab !== undefined;
  const currentActiveTab = isControlled ? activeTab : internalActiveTab;
  
  // Refs for keyboard navigation
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  
  // Handle tab change
  const handleTabChange = (tabId: string) => {
    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    
    // Track rendered tabs for lazy loading
    if (lazyContent) {
      setRenderedTabs(prev => new Set([...prev, tabId]));
    }
    
    onChange?.(tabId);
  };
  
  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, tabId: string) => {
    const tabIds = items.filter(item => !item.disabled).map(item => item.id);
    const currentIndex = tabIds.indexOf(tabId);
    
    let nextIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabIds.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex < tabIds.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = tabIds.length - 1;
        break;
      default:
        return;
    }
    
    const nextTabId = tabIds[nextIndex];
    const nextTabRef = tabRefs.current.get(nextTabId);
    if (nextTabRef) {
      nextTabRef.focus();
      handleTabChange(nextTabId);
    }
  };
  
  // Build CSS classes
  const tabsClasses = cn(
    l_prx,
    getSizeClasses(size),
    getVariantClasses(variant),
    orientation === 'vertical' && `${l_prx}-vertical`,
    fullWidth && `${l_prx}-full-width`,
    className
  );
  
  const tabListClasses = cn(
    `${l_prx}-list`,
    orientation === 'vertical' ? `${l_prx}-list-vertical` : `${l_prx}-list-horizontal`
  );

  return (
    <div 
      ref={ref}
      className={tabsClasses}
      {...props}
    >
      {/* Tab List */}
      <div
        ref={tabListRef}
        className={tabListClasses}
        role="tablist"
        aria-orientation={orientation}
      >
        {items.map((item) => {
          const isActive = item.id === currentActiveTab;
          const isDisabled = item.disabled;
          
          return (
            <button
              key={item.id}
              ref={(el) => {
                if (el) {
                  tabRefs.current.set(item.id, el);
                } else {
                  tabRefs.current.delete(item.id);
                }
              }}
              className={cn(
                `${lib}-tab`,
                isActive && `${lib}-tab-active`,
                isDisabled && `${lib}-tab-disabled`
              )}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${item.id}-panel`}
              id={`${item.id}-tab`}
              tabIndex={isActive ? 0 : -1}
              disabled={isDisabled}
              onClick={() => !isDisabled && handleTabChange(item.id)}
              onKeyDown={(e) => !isDisabled && handleKeyDown(e, item.id)}
            >
              {item.icon && (
                <span className={`${lib}-tab-icon`}>
                  {item.icon}
                </span>
              )}
              
              <span className={`${lib}-tab-label`}>
                {item.label}
              </span>
              
              {item.badge && (
                <span className={`${lib}-tab-badge`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Tab Panels */}
      <div className={`${l_prx}-content`}>
        {items.map((item) => {
          const isActive = item.id === currentActiveTab;
          const shouldRender = !lazyContent || renderedTabs.has(item.id);
          const shouldShow = keepContentMounted ? isActive : shouldRender && isActive;
          
          if (!shouldRender) {
            return null;
          }
          
          return (
            <div
              key={item.id}
              id={`${item.id}-panel`}
              className={cn(
                `${lib}-tab-panel`,
                isActive ? `${lib}-tab-panel-active` : `${lib}-tab-panel-hidden`
              )}
              role="tabpanel"
              aria-labelledby={`${item.id}-tab`}
              hidden={!shouldShow}
              tabIndex={0}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
});

Tabs.displayName = 'Tabs';

export { Tabs };