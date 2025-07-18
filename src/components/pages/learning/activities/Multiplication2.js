'use client';

import { useState, useEffect } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import Arithmetic2Input from '../common/Arithmetic2Input';

export default function Multiplication2Activity({ user }) {
  // Static 2-digit multiplication problems based on the UI image
  const multiplication2Data = [
    {
      op1: "324",
      op2: "34",
      result: "_",
      answer: "11016", 
      operator: "*"
    },
    {
      op1: "32",
      op2: "12",
      result: "_",
      answer: "384",
      operator: "*"
    }
  ];

  const [calcData, setCalcData] = useState([]);

  useEffect(() => {
    setCalcData(multiplication2Data);
  }, []);

  return (
    <ActivityLayout title="Two-digit Multiplication" user={user}>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 text-white px-8 py-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-center">Two-Digits Multiplication</h1>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-wrap justify-center">
              {calcData.map((item, i) => (
                <Arithmetic2Input data={item} key={i} />
              ))}
            </div>
          </div>

          <div className="mt-8 text-center pb-6">
            <p className="text-gray-600">
              Practice two-digit multiplication! Fill in each box with one digit at a time.
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 