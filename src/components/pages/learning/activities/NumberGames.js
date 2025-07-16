'use client';

import { useState, useEffect } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import GameCard from '../common/GameCard';
import { useAudio } from '../hooks/useAudio';

const numbers = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

export default function NumberGamesActivity() {
  const [blanks, setBlanks] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [resetCounter, setResetCounter] = useState(0);
  const { speak } = useAudio();

  useEffect(() => {
    refreshGame();
  }, []);

  const refreshGame = () => {
    // Generate 3 random positions for blanks (one for each row)
    const newBlanks = [];
    for (let i = 0; i < 3; i++) {
      const ranIndex = Math.floor(Math.random() * 4);
      newBlanks.push(i * 4 + ranIndex);
    }
    setBlanks(newBlanks);
    setSelectedNumber(null);
    setResetCounter(prev => prev + 1); // Increment reset counter to trigger GameCard reset
  };

  const handleNumberClick = (number) => {
    setSelectedNumber(number);
    speak(number);
  };

  return (
    <ActivityLayout title="Number Games">
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 py-2">
            <h1 className="text-3xl font-bold text-gray-800">
              Number Games
            </h1>
            <button
              onClick={refreshGame}
              className="px-4 py-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition-colors"
            >
              REFRESH
            </button>
          </div>

          <div className="flex flex-wrap -mx-2">
            {numbers.map((number, index) => {
              const isBlank = blanks.includes(index);
              
              return (
                <div key={index} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2">
                  <GameCard
                    text={isBlank ? '' : number}
                    isBlank={isBlank}
                    expectedValue={isBlank ? number : undefined}
                    onClick={() => handleNumberClick(number)}
                    resetKey={resetCounter}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 