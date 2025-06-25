// "use client";
import "../globals.css";
import clsx from "clsx";
import { Providers } from "../providers";
import NextTopLoader from "nextjs-toploader";
import Layout from "@components/layout/layout";

export default function RootLayout({ children }) {
  return <Layout>{children}</Layout>;
}
