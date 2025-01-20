"use client";

import client from "@lib/apolloClient";
import { useRouter } from "next/navigation";
import { ApolloProvider } from "@apollo/client";
import { HeroUIProvider } from "@heroui/system";
import { HeaderSlotProvider } from "@components/layout/header";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children, themeProps }) {
  const router = useRouter();
  return (
    // <UserProvider>
    // </UserProvider>
    (<ApolloProvider client={client}>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>
          <HeaderSlotProvider>{children}</HeaderSlotProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </ApolloProvider>)
  );
}
