import '@testing-library/jest-dom';
import { Button } from '@anukit/components/Button/Button';
import { Modal } from '@anukit/components/Modal/Modal';
import {
  testSSRCompatibility,
  testProgressiveEnhancement,
  measureHydrationTime,
  testSSRAccessibility,
  testThemeCompatibility,
  testResponsiveSSR,
} from '@anukit/core/testing/ssr-test-utils';

describe('AnuKit SSR Compatibility', () => {
  describe('Button Component', () => {
    test('renders without hydration mismatches', async () => {
      await testSSRCompatibility(() => <Button>Test Button</Button>);
    });

    test('maintains accessibility in SSR', async () => {
      await testSSRAccessibility(() => (
        <div>
          <Button>Primary Button</Button>
          <Button disabled>Disabled Button</Button>
          <Button loading>Loading Button</Button>
        </div>
      ));
    });

    test('works with all themes', async () => {
      await testThemeCompatibility(() => (
        <div>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
        </div>
      ));
    });

    test('hydration performance is acceptable', async () => {
      const hydrationTime = await measureHydrationTime(() => (
        <div>
          {Array.from({ length: 10 }, (_, i) => (
            <Button key={i} variant="primary">
              Button {i}
            </Button>
          ))}
        </div>
      ));

      // Hydration should complete within 100ms
      expect(hydrationTime).toBeLessThan(100);
    });
  });

  describe('Modal Component', () => {
    test('implements progressive enhancement correctly', async () => {
      await testProgressiveEnhancement(
        () => (
          <Modal isOpen={true} onClose={() => {}} title="Test Modal">
            <p>Modal content</p>
          </Modal>
        ),
        'fixed inset-0' // Portal-specific class that should only appear on client
      );
    });

    test('renders accessibility attributes correctly', async () => {
      await testSSRAccessibility(() => (
        <Modal isOpen={true} onClose={() => {}} title="Accessible Modal">
          <div>
            <h2>Modal Content</h2>
            <button type="button">Action Button</button>
          </div>
        </Modal>
      ));
    });

    test('handles responsive behavior in SSR', async () => {
      await testResponsiveSSR(() => (
        <Modal isOpen={true} onClose={() => {}} size="md">
          <p>Responsive modal content</p>
        </Modal>
      ));
    });
  });

  describe('SSR Provider', () => {
    test('generates consistent IDs across server and client', async () => {
      const TestComponent = () => {
        const id1 = useSSRSafeId('test');
        const id2 = useSSRSafeId('test');
        return (
          <div>
            <span data-testid="id1">{id1}</span>
            <span data-testid="id2">{id2}</span>
          </div>
        );
      };

      await testSSRCompatibility(TestComponent);
    });

    test('handles theme switching without hydration issues', async () => {
      const TestComponent = () => {
        const { resolvedTheme } = useTheme();
        return <div data-theme={resolvedTheme}>Content</div>;
      };

      await testThemeCompatibility(TestComponent);
    });
  });
});