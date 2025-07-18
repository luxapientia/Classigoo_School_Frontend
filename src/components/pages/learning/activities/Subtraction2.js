'use client';

import { useState, useEffect } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import Arithmetic2Input from '../common/Arithmetic2Input';

// Static data for two-digit subtraction problems matching the UI
const subtraction2Data = [
  {
    op1: "44",
    op2: "22", 
    result: "_",
    answer: "22",
    operator: "-"
  },
  {
    op1: "99",
    op2: "_",
    result: "15", 
    answer: "84",
    operator: "-"
  },
  {
    op1: "78",
    op2: "_",
    result: "15",
    answer: "63",
    operator: "-"
  },
  {
    op1: "66",
    op2: "33",
    result: "_",
    answer: "33",
    operator: "-"
  }
];

export default function Subtraction2Activity({ user }) {
  const [calcData, setCalcData] = useState([]);

  useEffect(() => {
    setCalcData(subtraction2Data);
  }, []);

  return (
    <ActivityLayout title="Two-digit Subtraction">
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 text-white px-8 py-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-center">Two-Digits Subtraction</h1>
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
              Practice two-digit subtraction! Fill in each box with one digit at a time.
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 