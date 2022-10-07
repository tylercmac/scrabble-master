const {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} = require("@remix-run/react");
const globalStyles = require("~/styles/app.css")

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
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
    },
    // {
    //   rel: "stylesheet",
    //   href: "https://fonts.googleapis.com/css?family=Oswald",
    // },
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
