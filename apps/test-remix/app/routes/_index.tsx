import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { Button } from "@anukit/components";
import { Modal } from "@anukit/components";
import { useTheme, useMediaQuery } from "@anukit/core";

export const meta: MetaFunction = () => {
  return [
    { title: "AnuKit Remix SSR Test" },
    { name: "description", content: "Testing AnuKit components with Remix SSR" },
  ];
};

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleAsyncAction = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <main className={`min-h-screen p-8 ${resolvedTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          OptimUI SSR Test with Remix
        </h1>

        {/* Hydration Status */}
        <section className="mb-8 p-6 border rounded-lg bg-green-50">
          <h2 className="text-2xl font-semibold mb-4">Hydration Status</h2>
          <p className="mb-2">
            <strong>Hydrated:</strong> {hydrated ? '✅ Yes' : '⏳ Hydrating...'}
          </p>
          <p className="text-sm text-gray-600">
            This shows the component hydration process in Remix.
          </p>
        </section>

        {/* Theme Controls */}
        <section className="mb-8 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Theme Testing</h2>
          <p className="mb-4">
            Current theme: {theme} (resolved: {resolvedTheme})
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button 
              variant={theme === 'light' ? 'primary' : 'secondary'}
              onClick={() => setTheme('light')}
            >
              Light Theme
            </Button>
            <Button 
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              onClick={() => setTheme('dark')}
            >
              Dark Theme
            </Button>
            <Button 
              variant={theme === 'auto' ? 'primary' : 'secondary'}
              onClick={() => setTheme('auto')}
            >
              Auto Theme
            </Button>
          </div>
        </section>

        {/* Responsive Testing */}
        <section className="mb-8 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Responsive Testing</h2>
          <p className="mb-4">
            Device type: {isMobile ? 'Mobile' : 'Desktop'}
          </p>
          <p className="text-sm text-gray-600">
            SSR-safe responsive behavior that doesn't cause hydration mismatches.
          </p>
        </section>

        {/* Component Testing */}
        <section className="mb-8 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Component Testing</h2>
          
          {/* Button variants */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Button Variants</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          {/* Button sizes */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Button Sizes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* Interactive buttons */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Interactive States</h3>
            <div className="flex gap-4 flex-wrap">
              <Button 
                loading={loading} 
                onClick={handleAsyncAction}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Async Action'}
              </Button>
              <Button disabled>Disabled</Button>
              <Button onClick={() => setIsModalOpen(true)}>
                Open Modal
              </Button>
            </div>
          </div>
        </section>

        {/* Modal Testing */}
        <section className="mb-8 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Modal Component</h2>
          <p className="mb-4 text-sm text-gray-600">
            Modal demonstrates progressive enhancement pattern in Remix SSR environment.
          </p>
          
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Remix SSR Modal"
            size="md"
          >
            <div className="space-y-4">
              <p>
                This modal is rendered using Remix's SSR capabilities with OptimUI's progressive enhancement.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">SSR Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Server-side placeholder rendering</li>
                  <li>Client-side portal enhancement</li>
                  <li>Focus trap implementation</li>
                  <li>Scroll lock management</li>
                  <li>Keyboard navigation support</li>
                </ul>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsModalOpen(false)}>
                  Close Modal
                </Button>
                <Button variant="secondary">
                  Secondary Action
                </Button>
              </div>
            </div>
          </Modal>
        </section>

        {/* Performance Metrics */}
        <section className="mb-8 p-6 border rounded-lg bg-purple-50">
          <h2 className="text-2xl font-semibold mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">SSR Benefits:</h3>
              <ul className="text-sm space-y-1">
                <li>✅ Faster initial page load</li>
                <li>✅ Better SEO crawling</li>
                <li>✅ Improved accessibility</li>
                <li>✅ Progressive enhancement</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">OptimUI Features:</h3>
              <ul className="text-sm space-y-1">
                <li>✅ Zero hydration mismatches</li>
                <li>✅ Optimal bundle splitting</li>
                <li>✅ Critical CSS inlining</li>
                <li>✅ Tree-shaking support</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Framework Comparison */}
        <section className="mb-8 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Remix vs Next.js</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Feature</th>
                  <th className="text-left p-2">Remix</th>
                  <th className="text-left p-2">Next.js</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b">
                  <td className="p-2">SSR Strategy</td>
                  <td className="p-2">Nested routing focused</td>
                  <td className="p-2">Page-based routing</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Data Loading</td>
                  <td className="p-2">Loader functions</td>
                  <td className="p-2">getServerSideProps</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">OptimUI Integration</td>
                  <td className="p-2">✅ Full support</td>
                  <td className="p-2">✅ Full support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}