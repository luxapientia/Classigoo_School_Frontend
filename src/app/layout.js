// "use client";
import "./globals.css";
import clsx from "clsx";
import { Providers } from "./providers";
import NextTopLoader from "nextjs-toploader";
import Layout from "../components/layout/layout";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={clsx("min-h-screen dark:bg-gray-900 bg-white antialiased font-poppins")}
        suppressHydrationWarning
      >
        <NextTopLoader showSpinner={false} height={3} color="#e74c3c" />
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
