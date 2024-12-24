"use client";

import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="flex justify-center items-center">
        <button
          className="dark:flex hidden w-11 h-11 bg-gray-800 rounded-full justify-center items-center"
          onClick={() => setTheme("light")}
        >
          <Icon
            icon="solar:sun-2-bold-duotone"
            className="w-6 h-6 text-white"
          />
        </button>
        <button
          className="dark:hidden flex w-11 h-11 bg-gray-100 rounded-full justify-center items-center"
          onClick={() => setTheme("dark")}
        >
          <Icon icon="solar:moon-bold" className="w-6 h-6 text-gray-900" />
        </button>
      </div>
    </>
  );
}
