"use client";
import { useRouter } from "next/navigation";

export default function NotFoundComponent() {
  return (
    <div className="grid items-center justify-center h-[calc(100vh_-_104px)] bg-white">
      <img
        src="/images/pages/404.svg"
        alt="Coming Soon"
        className="w-[750px] max-w-[calc(100vw_-_20px)] max-h-[calc(100vh_-_120px)]"
      />
    </div>
  );
}
