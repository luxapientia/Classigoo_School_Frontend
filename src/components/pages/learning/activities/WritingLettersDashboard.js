'use client';

import ActivityLayout from '../common/ActivityLayout';
import LetterCard from '../common/LetterCard';

export default function WritingLettersDashboard({ user }) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <ActivityLayout title="Writing Letters" user={user}>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-center">Writing Letters</h1>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-wrap justify-center gap-4">
              {alphabet.map((letter, index) => (
                <div key={index} className="mb-10">
                  <LetterCard letter={letter} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center pb-6">
            <p className="text-gray-600">
              Click on any letter to learn how to write it! Practice tracing and writing each letter of the alphabet.
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 