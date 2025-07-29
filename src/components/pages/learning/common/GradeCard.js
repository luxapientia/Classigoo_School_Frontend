'use client';

import { useRouter } from 'next/navigation';

export default function GradeCard({ name, value, onClick }) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(value);
    } else {
      router.push(`/learning/learning-screen?grade=${value}`);
    }
  };

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3">
      <div 
        onClick={handleClick}
        className="bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 transform hover:scale-105"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <p className="text-blue-100 text-sm">Click to select</p>
        </div>
      </div>
    </div>
  );
} 