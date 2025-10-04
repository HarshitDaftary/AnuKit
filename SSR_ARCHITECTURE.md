# AnuKit SSR-First Architecture

## Overview
This document outlines the Server-Side Rendering (SSR) first architecture for AnuKit, ensuring optimal performance, hydration, and compatibility with modern React frameworks like Next.js and Remix.

## Core SSR Principles

### 1. Hydration-Safe Components
- All components must render identically on server and client
- No browser-only APIs during initial render
- Proper `useEffect` usage for client-only features
- Consistent styling between server and client

### 2. CSS-in-JS SSR Strategy
- Server-side style extraction
- Critical CSS inlining
- Deduplication of styles
- Progressive enhancement

### 3. Zero Hydration Mismatches
- Deterministic rendering
- Server-client state synchronization
- Proper `suppressHydrationWarning` usage where needed

## Architecture Components

### Core SSR Provider
```typescript
// packages/core/src/providers/SSRProvider.tsx
interface SSRContextValue {
  isServer: boolean;
  isClient: boolean;
  prefix: string;
  generateId: () => string;
}
```

### Style System Integration
- **CSS Variables**: Server-safe CSS custom properties
- **Critical CSS**: Automatic extraction and inlining
- **Style Hydration**: Seamless client-side style takeover

### Component Design Patterns

#### 1. Progressive Enhancement
```typescript
// Example: Modal component
const Modal = ({ children, isOpen }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Server renders basic structure
  if (!mounted) {
    return <div className="modal-placeholder">{children}</div>;
  }
  
  // Client enhances with portal
  return createPortal(
    <ModalContent>{children}</ModalContent>,
    document.body
  );
};
```

#### 2. ID Generation Strategy
```typescript
// Deterministic ID generation for SSR
const useSSRSafeId = (prefix?: string) => {
  const { generateId, prefix: contextPrefix } = useSSRContext();
  return useMemo(() => generateId(prefix || contextPrefix), []);
};
```

#### 3. Media Query Handling
```typescript
// SSR-safe responsive behavior
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  // Return false during SSR, actual value after hydration
  return mounted ? matches : false;
};
```

## Framework Integration

### Next.js Integration

#### 1. Custom Document Setup
```typescript
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';
import { extractCriticalCSS } from '@anukit/core';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Critical CSS injection */}
        <style dangerouslySetInnerHTML={{ __html: extractCriticalCSS() }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

#### 2. App Wrapper
```typescript
// pages/_app.tsx
import { AnuKitProvider } from '@anukit/core';

export default function App({ Component, pageProps }) {
  return (
    <AnuKitProvider>
      <Component {...pageProps} />
    </AnuKitProvider>
  );
}
```

### Remix Integration

#### 1. Root Component
```typescript
// app/root.tsx
import { AnuKitProvider, getSSRStyles } from '@anukit/core';

export const links: LinksFunction = () => [
  // Critical CSS
  { rel: 'stylesheet', href: getSSRStyles() }
];

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <AnuKitProvider>
          <Outlet />
        </AnuKitProvider>
        <Scripts />
      </body>
    </html>
  );
}
```

## Performance Optimizations

### 1. Critical CSS Strategy
- Extract above-the-fold component styles
- Inline critical CSS in HTML head
- Load non-critical CSS asynchronously
- Remove unused CSS via PurgeCSS

### 2. Code Splitting
- Component-level code splitting
- Lazy loading for non-critical components
- Dynamic imports with SSR support

### 3. Bundle Optimization
- Tree-shaking at component level
- Individual component imports
- Minimal runtime overhead

## Testing Strategy

### SSR Compatibility Tests
1. **Hydration Tests**: Verify no hydration mismatches
2. **Performance Tests**: Measure TTFB, FCP, LCP
3. **Framework Tests**: Test with Next.js and Remix
4. **Browser Tests**: Cross-browser SSR compatibility

### Test Implementation
```typescript
// tests/ssr.test.tsx
describe('SSR Compatibility', () => {
  test('renders without hydration mismatches', async () => {
    const { container } = render(<Button>Test</Button>);
    const serverHTML = container.innerHTML;
    
    await act(async () => {
      hydrate(<Button>Test</Button>, container);
    });
    
    expect(container.innerHTML).toBe(serverHTML);
  });
});
```

## Implementation Checklist

### Phase 1: Core SSR Infrastructure
- [ ] SSR Provider implementation
- [ ] Style extraction system
- [ ] ID generation utilities
- [ ] Media query handling

### Phase 2: Component SSR Support
- [ ] Audit all components for SSR compatibility
- [ ] Implement progressive enhancement patterns
- [ ] Add SSR-safe hooks
- [ ] Update component documentation

### Phase 3: Framework Integration
- [ ] Next.js integration package
- [ ] Remix integration package
- [ ] Example applications
- [ ] Performance benchmarks

### Phase 4: Testing & Validation
- [ ] SSR test suite
- [ ] Performance testing
- [ ] Cross-browser validation
- [ ] Documentation updates

## Monitoring & Metrics

### Performance Metrics
- **Time to First Byte (TTFB)**: <200ms
- **First Contentful Paint (FCP)**: <1.5s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Cumulative Layout Shift (CLS)**: <0.1

### SSR-Specific Metrics
- **Hydration Time**: <100ms
- **Bundle Size Impact**: <5KB additional
- **Style Extraction Time**: <50ms
- **Server Memory Usage**: <10MB per request

## Best Practices

### 1. Component Guidelines
- Always use `useEffect` for browser-only code
- Implement fallbacks for server rendering
- Avoid `window` or `document` in render methods
- Use CSS variables for dynamic styling

### 2. Styling Guidelines
- Prefer CSS variables over runtime style injection
- Use progressive enhancement for animations
- Implement proper dark mode SSR support
- Minimize style recalculation

### 3. Performance Guidelines
- Implement proper code splitting
- Use React.memo strategically
- Minimize hydration payload
- Optimize critical rendering path

## Framework-Specific Considerations

### Next.js
- Custom Document for style injection
- Static optimization compatibility
- Image optimization integration
- Incremental Static Regeneration support

### Remix
- Nested routing considerations
- Resource route integration
- Progressive enhancement patterns
- Error boundary SSR handling

### Future Framework Support
- SvelteKit compatibility layer
- Astro component integration
- Solid.js SSR support
- Vue.js integration (future consideration)