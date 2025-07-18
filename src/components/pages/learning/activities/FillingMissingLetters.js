'use client';

import ActivityLayout from '../common/ActivityLayout';
import BlankInput from '../common/BlankInput';

const texts = [
  {
    text: "This is _ apple.",
    answer: "an",
  },
  {
    text: "What _ your name?",
    answer: "is",
  },
  {
    text: "Mind _ I smoke?",
    answer: "if",
  },
  {
    text: "Do you _ time?",
    answer: "have",
  },
  {
    text: "How old _ you?",
    answer: "are",
  },
];

export default function FillingMissingLettersActivity({ user }) {
  return (
    <ActivityLayout title="Filling Missing Letters">
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 sticky top-0 bg-gray-50 py-2">
            Filling Missing Letters
          </h1>
          
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              {texts.map((text, i) => (
                <BlankInput 
                  key={i}
                  {...text} 
                  no={i + 1} 
                />
              ))}
            </div>
          </div>

          <div className="mt-8 text-center pb-6">
            <p className="text-gray-600">
              Fill in the blanks with the correct words. You'll hear a sound when you get it right!
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 