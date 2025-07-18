'use client';

import { useState, useEffect } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import LongDivisionInput from '../common/LongDivisionInput';

export default function LongDivisionActivity({ user }) {
  // Static long division problems based on the UI image
  const longDivisionData = [
    {
      op1: "8880",
      op2: "8",
      result: "_",
      answer: "1110", 
      operator: "/"
    },
    {
      op1: "9720",
      op2: "9",
      result: "_",
      answer: "1080",
      operator: "/"
    },
    {
      op1: "10400",
      op2: "10",
      result: "_",
      answer: "1040",
      operator: "/"
    },
    {
      op1: "6300",
      op2: "6",
      result: "_",
      answer: "1050",
      operator: "/"
    },
    {
      op1: "1296",
      op2: "12",
      result: "_",
      answer: "108",
      operator: "/"
    },
    {
      op1: "5100",
      op2: "51",
      result: "_",
      answer: "100",
      operator: "/"
    }
  ];

  const [calcData, setCalcData] = useState([]);

  useEffect(() => {
    setCalcData(longDivisionData);
  }, []);

  return (
    <ActivityLayout title="Long Division" user={user}>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-center">Division Problem</h1>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-wrap justify-center">
              {calcData.map((item, i) => (
                <LongDivisionInput data={item} key={i} />
              ))}
            </div>
          </div>

          <div className="mt-8 text-center pb-6">
            <p className="text-gray-600">
              Practice long division using the DMSB method! Fill in each step carefully.
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 