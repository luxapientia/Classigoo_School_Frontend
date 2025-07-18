'use client';

import { useState, useEffect } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import Arithmetic2Input from '../common/Arithmetic2Input';

// Static data for two-digit addition problems
const addition2Data = [
  {
    op1: "11",
    op2: "12", 
    result: "_",
    answer: "23",
    operator: "+"
  },
  {
    op1: "86",
    op2: "21",
    result: "_", 
    answer: "107",
    operator: "+"
  },
  {
    op1: "85",
    op2: "_",
    result: "124",
    answer: "47",
    operator: "+"
  },
  {
    op1: "_",
    op2: "12",
    result: "67",
    answer: "55",
    operator: "+"
  },
  {
    op1: "15",
    op2: "66",
    result: "_",
    answer: "81",
    operator: "+"
  },
  {
    op1: "12", 
    op2: "56",
    result: "_",
    answer: "68",
    operator: "+"
  }
];

export default function Addition2Activity({ user }) {
  const [calcData, setCalcData] = useState([]);

  useEffect(() => {
    setCalcData(addition2Data);
  }, []);

  return (
    <ActivityLayout title="Two-digit Addition">
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 text-white px-8 py-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-center">Two-Digits Addition</h1>
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
              Practice two-digit addition! Fill in each box with one digit at a time.
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 