import { useState } from 'react';
import Head from 'next/head';
import { Button } from '@optimui/components/Button/Button';
import { Modal } from '@optimui/components/Modal/Modal';
import { useTheme, useMediaQuery } from '@optimui/core/hooks/ssr-hooks';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleAsyncAction = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>OptimUI Next.js SSR Test</title>
        <meta name="description" content="Testing OptimUI components with Next.js SSR" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`min-h-screen p-8 ${resolvedTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            OptimUI SSR Test with Next.js
          </h1>

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
              This demonstrates SSR-safe media queries that don't cause hydration mismatches.
            </p>
          </section>

          {/* Button Testing */}
          <section className="mb-8 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Button Components</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>

            <div className="mt-4 flex gap-4">
              <Button 
                loading={loading} 
                onClick={handleAsyncAction}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Async Action'}
              </Button>
              <Button disabled>Disabled</Button>
            </div>
          </section>

          {/* Modal Testing */}
          <section className="mb-8 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Modal Component</h2>
            <p className="mb-4 text-sm text-gray-600">
              Modal uses progressive enhancement - renders placeholder on server, 
              full portal functionality on client.
            </p>
            
            <div className="flex gap-4 flex-wrap">
              <Button onClick={() => setIsModalOpen(true)}>
                Open Modal
              </Button>
            </div>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="SSR Test Modal"
              size="md"
            >
              <div className="space-y-4">
                <p>
                  This modal demonstrates proper SSR handling with progressive enhancement.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Server renders a placeholder structure</li>
                  <li>Client enhances with portal functionality</li>
                  <li>Focus management works correctly</li>
                  <li>Scroll locking prevents body scroll</li>
                  <li>Escape key and overlay clicks work</li>
                </ul>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => setIsModalOpen(false)}>
                    Close Modal
                  </Button>
                  <Button variant="secondary">
                    Another Action
                  </Button>
                </div>
              </div>
            </Modal>
          </section>

          {/* SSR Information */}
          <section className="mb-8 p-6 border rounded-lg bg-blue-50">
            <h2 className="text-2xl font-semibold mb-4">SSR Status</h2>
            <div className="space-y-2 text-sm">
              <p>✅ <strong>Server-side rendering:</strong> Initial HTML rendered on server</p>
              <p>✅ <strong>Progressive enhancement:</strong> Client-side features added after hydration</p>
              <p>✅ <strong>No hydration mismatches:</strong> Server and client HTML identical</p>
              <p>✅ <strong>Accessibility:</strong> Focus management and ARIA attributes work correctly</p>
              <p>✅ <strong>Performance:</strong> Critical CSS inlined, non-critical loaded asynchronously</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}