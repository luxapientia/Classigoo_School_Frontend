'use client';

import { useRouter } from 'next/navigation';

export default function ActivityLayout({ children, title, showBackButton = true }) {
  const router = useRouter();

  // if the page is learning screen, then the back button should navigate to the learning screen dashboard
  const isLearningScreen = title === "Learning Activities";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {showBackButton && (
              <button
                onClick={() => isLearningScreen ? router.push("/") : router.push("/learning")}
                className="text-sky-600 hover:text-sky-700 flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back</span>
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <div className="w-20" /> {/* Spacer for alignment */}
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 