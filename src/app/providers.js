"use client";

import client from "@lib/apolloClient";
import { useRouter } from "next/navigation";
import { ApolloProvider } from "@apollo/client";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children, themeProps }) {
  const router = useRouter();
  return (
    // <UserProvider>
    <ApolloProvider client={client}>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </NextUIProvider>
    </ApolloProvider>
    // </UserProvider>
  );
}
