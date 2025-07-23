'use client';

import { longVowelsData } from '../common/longVowelsData';
import VowelCard from '../common/VowelCard';
import ActivityLayout from '../common/ActivityLayout';

export default function LongVowelsDashboard({ user }) {
  return (
    <ActivityLayout title="Long Vowels" user={user}>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-center">Long Vowels</h1>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-wrap justify-center gap-4">
              {longVowelsData.map((vowel, index) => (
                <div key={index} className="mb-10 text-[25px]">
                  <VowelCard vowel={vowel.name} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center pb-6">
            <p className="text-gray-600">
              Click on any long vowel to practice reading passages and answering questions! Learn about "ue", "ew", and "ui" vowel patterns.
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 