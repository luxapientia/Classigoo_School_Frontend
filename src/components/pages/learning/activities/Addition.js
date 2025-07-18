'use client';

import { useState, useEffect } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import ArithmeticInput from '../common/ArithmeticInput';

// Static data matching the original arithmetic problems
const additionData = [
  {
    op1: "23",
    op2: "12", 
    result: "_",
    answer: "35",
    operator: "+"
  },
  {
    op1: "44",
    op2: "33",
    result: "_", 
    answer: "77",
    operator: "+"
  },
  {
    op1: "33",
    op2: "44",
    result: "_",
    answer: "77", 
    operator: "+"
  },
  {
    op1: "77",
    op2: "38",
    result: "_",
    answer: "115",
    operator: "+"
  },
  {
    op1: "99",
    op2: "11", 
    result: "_",
    answer: "110",
    operator: "+"
  },
  {
    op1: "48",
    op2: "11",
    result: "_",
    answer: "59",
    operator: "+"
  },
  {
    op1: "48", 
    op2: "10",
    result: "_",
    answer: "58",
    operator: "+"
  },
  {
    op1: "_",
    op2: "14",
    result: "25",
    answer: "11",
    operator: "+"
  },
  {
    op1: "24",
    op2: "32",
    result: "_", 
    answer: "56",
    operator: "+"
  },
  {
    op1: "3",
    op2: "_",
    result: "7", 
    answer: "4",
    operator: "+"
  },
  {
    op1: "1",
    op2: "_",
    result: "10",
    answer: "9", 
    operator: "+"
  }
];

export default function AdditionActivity() {
  const [calcData, setCalcData] = useState([]);

  useEffect(() => {
    setCalcData(additionData);
  }, []);

  return (
    <ActivityLayout title="Addition">
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-center">Addition</h1>
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
              Solve the addition problems. Fill in the blanks with the correct numbers!
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 