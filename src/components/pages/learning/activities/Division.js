'use client';

import { useState, useEffect } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import ArithmeticInput from '../common/ArithmeticInput';

export default function DivisionActivity({ user }) {
  // Static division problems based on the UI image
  const divisionData = [
    {
      op1: "105",
      op2: "5",
      result: "_",
      answer: "21", 
      operator: "/"
    },
    {
      op1: "135",
      op2: "3", 
      result: "_",
      answer: "45",
      operator: "/"
    },
    {
      op1: "56",
      op2: "14",
      result: "_", 
      answer: "4",
      operator: "/"
    },
    {
      op1: "64",
      op2: "32",
      result: "_",
      answer: "2",
      operator: "/"
    },
    {
      op1: "100",
      op2: "10",
      result: "_",
      answer: "10",
      operator: "/"
    }
  ];

  const [calcData, setCalcData] = useState([]);

  useEffect(() => {
    setCalcData(divisionData);
  }, []);

  return (
    <ActivityLayout title="Division" user={user}>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-center">Division</h1>
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
              Practice division! Enter the missing number to complete each equation.
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 