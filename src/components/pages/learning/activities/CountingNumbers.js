'use client';

import { useState, useMemo } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import ActivityCard from '../common/SpeechCard';
import { useAudio } from '../hooks/useAudio';

export default function CountingNumbersActivity() {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { speak } = useAudio();

  const numbers = useMemo(() => {
    const result = [];
    for (let i = 1; i <= 100; i++) {
      result.push(i.toString());
    }
    return result;
  }, []);

  const pageSize = 20; // Show 20 numbers per page
  const totalPages = Math.ceil(numbers.length / pageSize);

  const currentNumbers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return numbers.slice(start, start + pageSize);
  }, [numbers, currentPage]);

  const handleNumberClick = (number) => {
    setSelectedNumber(number);
    speak(number);
  };

  return (
    <ActivityLayout title="Counting Numbers">
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="sticky top-0 bg-gray-50 py-2 z-10">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Counting Numbers (1-100)
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-rose-400 text-white hover:bg-rose-500'
                  }`}
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-rose-400 text-white hover:bg-rose-500'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap -mx-2">
            {currentNumbers.map((number) => (
              <div key={number} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2">
                <ActivityCard
                  text={number}
                  isSelected={selectedNumber === number}
                  onClick={() => handleNumberClick(number)}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center pb-6">
            <p className="text-gray-600">
              Click on a number to hear it pronounced
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 