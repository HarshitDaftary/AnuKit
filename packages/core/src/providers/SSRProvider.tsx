import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

interface SSRContextValue {
  isServer: boolean;
  isClient: boolean;
  prefix: string;
  generateId: (customPrefix?: string) => string;
  styles: Set<string>;
  addStyle: (style: string) => void;
}

const SSRContext = createContext<SSRContextValue | null>(null);

interface SSRProviderProps {
  children: React.ReactNode;
  prefix?: string;
}

let idCounter = 0;

export const SSRProvider: React.FC<SSRProviderProps> = ({ 
  children, 
  prefix = 'anukit' 
}) => {
  const [isClient, setIsClient] = useState(false);
  const [styles] = useState(() => new Set<string>());

  useEffect(() => {
    setIsClient(true);
  }, []);

  const value = useMemo<SSRContextValue>(() => ({
    isServer: typeof window === 'undefined',
    isClient,
    prefix,
    generateId: (customPrefix?: string) => {
      const finalPrefix = customPrefix || prefix;
      return `${finalPrefix}-${++idCounter}`;
    },
    styles,
    addStyle: (style: string) => {
      styles.add(style);
    }
  }), [isClient, prefix, styles]);

  return (
    <SSRContext.Provider value={value}>
      {children}
    </SSRContext.Provider>
  );
};

export const useSSRContext = (): SSRContextValue => {
  const context = useContext(SSRContext);
  if (!context) {
    throw new Error('useSSRContext must be used within an SSRProvider');
  }
  return context;
};

export const useSSRSafeId = (customPrefix?: string): string => {
  const { generateId } = useSSRContext();
  return useMemo(() => generateId(customPrefix), [generateId, customPrefix]);
};

// Critical CSS extraction for server-side rendering
export const extractCriticalCSS = (): string => {
  if (typeof window !== 'undefined') {
    return '';
  }
  
  // This would be populated during server-side rendering
  const context = useContext(SSRContext);
  if (!context) return '';
  
  return Array.from(context.styles).join('\n');
};

// Style hydration utilities
export const hydrateStyles = (): void => {
  if (typeof window === 'undefined') return;
  
  // Remove server-side styles after hydration
  const serverStyles = document.querySelector('[data-anukit-ssr-styles]');
  if (serverStyles) {
    serverStyles.remove();
  }
};

export { SSRContext };