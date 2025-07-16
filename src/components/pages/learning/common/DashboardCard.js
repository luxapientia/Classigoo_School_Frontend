'use client';

import { useRouter } from 'next/navigation';

export default function Card({ name, link }) {
  const router = useRouter();

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3">
      <div 
        onClick={() => router.push(link)}
        className={`
          w-full aspect-[4/3] rounded-lg shadow-md 
          bg-sky-400 hover:bg-sky-500 transition-all
          flex items-center justify-center cursor-pointer
          p-4 text-white font-medium
          hover:shadow-lg hover:scale-[1.02]
          transform-gpu overflow-hidden
        `}
      >
        <div className="w-full flex items-center justify-center">
          <h4 className="text-base sm:text-lg md:text-xl text-center break-words line-clamp-3">
            {name}
          </h4>
        </div>
      </div>
    </div>
  );
}
