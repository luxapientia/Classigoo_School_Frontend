"use client";

import React from "react";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";
import { ThemeSwitcher } from "./theme-switcher";

export default function Layout({ children }) {
  return (
    <>
      {/* <ThemeSwitcher /> */}

      <section className="h-[100vh] flex">
        <aside className="flex-initial border-r-1.5 dark:border-gray-800">
          <Sidebar />
        </aside>
        <section className="flex-auto">
          <Header />
          <main className="p-5">{children}</main>
        </section>
      </section>
    </>
  );
}
