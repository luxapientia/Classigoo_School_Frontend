"use client";
import "../globals.css";
import { Suspense } from 'react';
import Layout from "@components/layout/layout";

function LoadingLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-8">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-red-500 animate-spin mx-auto"></div>
        <div className="text-center text-gray-500 dark:text-gray-400">Loading your workspace...</div>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <Suspense fallback={<LoadingLayout />}>
      <Layout>{children}</Layout>
    </Suspense>
  );
}
