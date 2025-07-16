'use client';

import { useState } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import SpeechCard from '../common/SpeechCard';
import { useAudio } from '../hooks/useAudio';

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function NumbersActivity() {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const { speak } = useAudio();

  const handleNumberClick = (number) => {
    setSelectedNumber(number);
    speak(number);
  };

  return (
    <ActivityLayout title="Numbers">
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 sticky top-0 bg-gray-50 py-2">
            Numbers
          </h1>
          
          <div className="flex flex-wrap -mx-2">
            {numbers.map((number) => (
              <div key={number} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2">
                <SpeechCard
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