'use client';

import { useRouter } from 'next/navigation';

export default function SubjectCard({ name, link, description, onClick }) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick({ name, link, description });
    } else {
      router.push(link);
    }
  };

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-3 mb-6">
      <div 
        onClick={handleClick}
        className="bg-gradient-to-br from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 transform hover:scale-105"
      >
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">{name}</h3>
          {description && (
            <p className="text-green-100 text-sm">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
} 