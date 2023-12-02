import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import globalStyles from "~/styles/app.css"

export const meta = () => ({
  charset: "utf-8",
  title: "ScrabbleMaster",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css",
    },
    {
      rel: "stylesheet",
      href: globalStyles,
    }
  ];
}



export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet surpressHydrationWarning/>
        <ScrollRestoration />
        <Scripts>
        </Scripts>
        <LiveReload />
      </body>
    </html>
  );
}
