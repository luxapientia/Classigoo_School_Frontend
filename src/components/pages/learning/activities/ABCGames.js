'use client';

import { useState, useEffect } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import GameCard from '../common/GameCard';
import { useAudio } from '../hooks/useAudio';

const letters = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

export default function ABCGamesActivity() {
  const [blanks, setBlanks] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [resetCounter, setResetCounter] = useState(0);
  const { speak } = useAudio();

  useEffect(() => {
    refreshGame();
  }, []);

  const refreshGame = () => {
    // Generate 7 random positions for blanks (one for each row of 4)
    const newBlanks = [];
    for (let i = 0; i < 7; i++) {
      const ranIndex = Math.floor(Math.random() * 4);
      newBlanks.push(i * 4 + ranIndex);
    }
    setBlanks(newBlanks);
    setSelectedLetter(null);
    setResetCounter(prev => prev + 1); // Increment reset counter to trigger GameCard reset
  };

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    speak(letter.toUpperCase());
  };

  return (
    <ActivityLayout title="ABC Games">
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 py-2">
            <h1 className="text-3xl font-bold text-gray-800">
              ABC Games
            </h1>
            <button
              onClick={refreshGame}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              REFRESH
            </button>
          </div>

          <div className="flex flex-wrap -mx-2">
            {letters.map((letter, index) => {
              const isBlank = blanks.includes(index);
              
              return (
                <div key={index} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2">
                  <GameCard
                    text={isBlank ? '' : letter.toUpperCase()}
                    isBlank={isBlank}
                    expectedValue={isBlank ? letter : undefined}
                    onClick={() => handleLetterClick(letter)}
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