import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Critical CSS will be injected here by AnuKit SSR provider */}
        <style
          id="anukit-ssr-styles"
          data-anukit-ssr-styles
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical AnuKit styles for SSR */
              .anukit-button { 
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-weight: 500;
                border-radius: 0.375rem;
                transition: background-color 0.2s;
              }
              .anukit-modal-open { 
                overflow: hidden; 
              }
              .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
              }
            `
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* Portal root for modals */}
        <div id="modal-root" />
      </body>
    </Html>
  );
}