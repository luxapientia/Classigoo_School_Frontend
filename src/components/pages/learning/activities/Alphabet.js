'use client';

import { useState, useCallback } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import SpeechCard from '../common/SpeechCard';
import { useAudio } from '../hooks/useAudio';

const letters = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

export default function AlphabetActivity() {
  const [letterCase, setLetterCase] = useState('lowercase');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const { speak } = useAudio();

  const toggleCase = useCallback(() => {
    setLetterCase(prev => prev === 'lowercase' ? 'uppercase' : 'lowercase');
  }, []);

  const handleLetterClick = (letter) => {
    const text = letterCase === 'lowercase' ? letter : letter.toUpperCase();
    setSelectedLetter(letter);
    speak(text);
  };

  return (
    <ActivityLayout title="Alphabets">
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 py-2">
            <h1 className="text-3xl font-bold text-gray-800">
              Alphabets
            </h1>
            <button
              onClick={toggleCase}
              className="px-4 py-2 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition-colors"
            >
              CHANGE TO {letterCase === 'lowercase' ? 'UPPERCASE' : 'LOWERCASE'}
            </button>
          </div>

          <div className="flex flex-wrap -mx-2">
            {letters.map((letter) => (
              <div key={letter} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2">
                <SpeechCard
                  text={letterCase === 'lowercase' ? letter : letter.toUpperCase()}
                  isSelected={selectedLetter === letter}
                  onClick={() => handleLetterClick(letter)}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center pb-6">
            <p className="text-gray-600">
              Click on a letter to hear it pronounced
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 