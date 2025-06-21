"use client";

import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@heroui/system";
import { HeaderSlotProvider } from "@components/layout/header";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@contexts/AuthContext";

export function Providers({ children, themeProps }) {
  const router = useRouter();
  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <AuthProvider>
          <HeaderSlotProvider>{children}</HeaderSlotProvider>
        </AuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
