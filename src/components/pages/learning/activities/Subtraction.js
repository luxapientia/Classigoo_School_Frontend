'use client';

import { useState, useEffect } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import ArithmeticInput from '../common/ArithmeticInput';

// Static data matching the subtraction problems from the UI
const subtractionData = [
  {
    op1: "15",
    op2: "_", 
    result: "6",
    answer: "9",
    operator: "-"
  },
  {
    op1: "10",
    op2: "_",
    result: "6", 
    answer: "4",
    operator: "-"
  },
  {
    op1: "9",
    op2: "_",
    result: "6",
    answer: "3",
    operator: "-"
  },
  {
    op1: "9",
    op2: "_",
    result: "6", 
    answer: "3",
    operator: "-"
  },
  {
    op1: "6",
    op2: "_", 
    result: "1",
    answer: "5",
    operator: "-"
  },
  {
    op1: "5",
    op2: "_",
    result: "1",
    answer: "4",
    operator: "-"
  },
  {
    op1: "6",
    op2: "_",
    result: "3",
    answer: "3",
    operator: "-"
  },
  {
    op1: "3",
    op2: "_",
    result: "1",
    answer: "2",
    operator: "-"
  },
  {
    op1: "10",
    op2: "_", 
    result: "1",
    answer: "9",
    operator: "-"
  }
];

export default function SubtractionActivity({ user }) {
  const [calcData, setCalcData] = useState([]);

  useEffect(() => {
    setCalcData(subtractionData);
  }, []);

  return (
    <ActivityLayout title="Subtraction">
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-center">Subtraction</h1>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-wrap justify-center">
              {calcData.map((item, i) => (
                <ArithmeticInput data={item} key={i} />
              ))}
            </div>
          </div>

          <div className="mt-8 text-center pb-6">
            <p className="text-gray-600">
              Solve the subtraction problems. Fill in the missing numbers!
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 