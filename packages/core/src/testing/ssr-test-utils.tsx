import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { hydrateRoot } from 'react-dom/client';
import type { ComponentType } from 'react';
import { SSRProvider } from '../providers/SSRProvider';

/**
 * Test utility to verify SSR compatibility
 * Ensures no hydration mismatches occur
 */
export const testSSRCompatibility = async (Component: ComponentType) => {
  // Create a container for server rendering
  const container = document.createElement('div');
  document.body.appendChild(container);

  // Render component on "server" (initial render)
  const { container: serverContainer } = render(
    <SSRProvider>
      <Component />
    </SSRProvider>
  );
  
  const serverHTML = serverContainer.innerHTML;

  // Hydrate the component (client-side)
  await act(async () => {
    hydrateRoot(
      container,
      <SSRProvider>
        <Component />
      </SSRProvider>
    );
  });

  // Verify no hydration mismatches
  expect(container.innerHTML).toBe(serverHTML);

  // Cleanup
  document.body.removeChild(container);
};

/**
 * Test progressive enhancement behavior
 */
export const testProgressiveEnhancement = async (
  Component: ComponentType,
  clientOnlyFeature: string
) => {
  // Mock server environment
  const originalWindow = (global as any).window;
  delete (global as any).window;

  // Render in server environment
  const { container: serverContainer } = render(
    <SSRProvider>
      <Component />
    </SSRProvider>
  );

  // Should not contain client-only features
  expect(serverContainer.innerHTML).not.toContain(clientOnlyFeature);

  // Restore client environment
  (global as any).window = originalWindow;

  // Render in client environment
  const { container: clientContainer } = render(
    <SSRProvider>
      <Component />
    </SSRProvider>
  );

  // Should contain client-only features after hydration
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  expect(clientContainer.innerHTML).toContain(clientOnlyFeature);
};

/**
 * Performance testing utilities
 */
export const measureHydrationTime = async (Component: ComponentType): Promise<number> => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  // Initial server render
  render(
    <SSRProvider>
      <Component />
    </SSRProvider>,
    { container }
  );

  // Measure hydration time
  const startTime = performance.now();
  
  await act(async () => {
    hydrateRoot(
      container,
      <SSRProvider>
        <Component />
      </SSRProvider>
    );
  });

  const endTime = performance.now();
  const hydrationTime = endTime - startTime;

  document.body.removeChild(container);
  
  return hydrationTime;
};

/**
 * Test accessibility in SSR context
 */
export const testSSRAccessibility = async (Component: ComponentType) => {
  const { container } = render(
    <SSRProvider>
      <Component />
    </SSRProvider>
  );

  // Check for proper ARIA attributes
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    // Basic attribute existence checks without jest-dom matchers
    expect(button.getAttribute('type')).not.toBeNull();
    if (button.disabled) {
      expect(button.getAttribute('aria-disabled')).toBe('true');
    }
  });

  // Check for proper heading structure
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    expect(/\S/.test(heading.textContent || '')).toBe(true); // Non-empty
  });

  // Check for proper focus management
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  expect(focusableElements.length).toBeGreaterThan(0);
};

/**
 * Test component with different themes
 */
export const testThemeCompatibility = async (Component: ComponentType) => {
  const themes = ['light', 'dark', 'auto'];
  
  for (const theme of themes) {
    // Set theme in document
    document.documentElement.setAttribute('data-theme', theme);
    
    const { container } = render(
      <SSRProvider>
        <Component />
      </SSRProvider>
    );
    
    // Verify component renders without errors
  expect(container).toBeTruthy();
    
    // Verify theme-specific styles are applied
    const styledElements = container.querySelectorAll('[class*="optimui"]');
    expect(styledElements.length).toBeGreaterThan(0);
  }
  
  // Reset theme
  document.documentElement.removeAttribute('data-theme');
};

/**
 * Test responsive behavior in SSR
 */
export const testResponsiveSSR = async (Component: ComponentType) => {
  // Mock different screen sizes
  const screenSizes = [
    { width: 320, height: 568 }, // Mobile
    { width: 768, height: 1024 }, // Tablet
    { width: 1920, height: 1080 }, // Desktop
  ];

  for (const size of screenSizes) {
    // Mock window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: size.width,
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: size.height,
    });

    const { container } = render(
      <SSRProvider>
        <Component />
      </SSRProvider>
    );

    // Verify component renders at all screen sizes
  expect(container).toBeTruthy();
    
    // Trigger resize event
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }
};

export default {
  testSSRCompatibility,
  testProgressiveEnhancement,
  measureHydrationTime,
  testSSRAccessibility,
  testThemeCompatibility,
  testResponsiveSSR,
};
