import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  LiveReload,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { SSRProvider } from "@optimui/core/providers/SSRProvider";

import stylesheet from "./styles/app.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Critical OptimUI styles for SSR */}
        <style
          id="optimui-ssr-styles"
          data-optimui-ssr-styles
          dangerouslySetInnerHTML={{
            __html: `
              .optimui-button { 
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-weight: 500;
                border-radius: 0.375rem;
                transition: background-color 0.2s;
              }
              .optimui-modal-open { 
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
      </head>
      <body>
        <SSRProvider prefix="remix-app">
          <Outlet />
        </SSRProvider>
        {/* Portal root for modals */}
        <div id="modal-root"></div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}