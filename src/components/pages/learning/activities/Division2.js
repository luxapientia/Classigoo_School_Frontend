'use client';

import { useState, useEffect } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import Arithmetic2Input from '../common/Arithmetic2Input';

export default function Division2Activity({ user }) {
  // Static 2-digit division problems based on the UI image
  const division2Data = [
    {
      op1: "125",
      op2: "5",
      result: "_",
      answer: "25", 
      operator: "/"
    },
    {
      op1: "144",
      op2: "8",
      result: "_",
      answer: "18",
      operator: "/"
    },
    {
      op1: "125",
      op2: "5",
      result: "_",
      answer: "25",
      operator: "/"
    }
  ];

  const [calcData, setCalcData] = useState([]);

  useEffect(() => {
    setCalcData(division2Data);
  }, []);

  return (
    <ActivityLayout title="Two-digit Division" user={user}>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 text-white px-8 py-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-center">Two-Digits Division</h1>
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
              Practice two-digit division! Fill in each box with one digit at a time.
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 