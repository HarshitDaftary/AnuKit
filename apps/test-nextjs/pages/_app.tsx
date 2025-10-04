import type { AppProps } from 'next/app';
import { SSRProvider } from '@anukit/core/providers/SSRProvider';
import { useEffect } from 'react';
import { hydrateStyles } from '@anukit/core/providers/SSRProvider';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove server-side styles after hydration
    hydrateStyles();
  }, []);

  return (
    <SSRProvider prefix="next-app">
      <Component {...pageProps} />
    </SSRProvider>
  );
}