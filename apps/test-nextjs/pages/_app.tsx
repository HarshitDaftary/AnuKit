import type { AppProps } from 'next/app';
import { SSRProvider, hydrateStyles } from '@anukit/core';
import { useEffect } from 'react';
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