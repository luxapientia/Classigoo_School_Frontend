"use client";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

export default function CommingSoonComponent() {
  const router = useRouter();
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-black">
      <div className="absolute top-5 left-5 z-10 bg-white/30 rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <Icon
          icon="heroicons:chevron-left-20-solid"
          className="text-gray-100 text-4xl cursor-pointer"
          onClick={() => router.back()}
        />
      </div>
      <img
        src="/images/pages/soon.svg"
        alt="Coming Soon"
        className="w-[750px] max-w-[calc(100vw_-_20px)] max-h-[calc(100vh_-_120px)]"
      />
    </div>
  );
}
