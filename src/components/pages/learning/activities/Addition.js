'use client';

import { useState, useEffect } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import ArithmeticInput from '../common/ArithmeticInput';

// Dynamic problem generator for addition (1, 2, and 3 digits)
const generateAdditionProblem = () => {
  // Generate random operands with different digit lengths
  let op1, op2;
  
  // 40% chance for 2-digit numbers, 40% chance for 1-digit numbers, 20% chance for 3-digit numbers
  const random = Math.random();
  
  if (random < 0.4) {
    // 1-digit numbers (1-9)
    op1 = Math.floor(Math.random() * 9) + 1;
    op2 = Math.floor(Math.random() * 9) + 1;
  } else if (random < 0.8) {
    // 2-digit numbers (10-99)
    op1 = Math.floor(Math.random() * 90) + 10;
    op2 = Math.floor(Math.random() * 90) + 10;
  } else {
    // 3-digit numbers (100-999)
    op1 = Math.floor(Math.random() * 900) + 100;
    op2 = Math.floor(Math.random() * 900) + 100;
  }
  
  const result = op1 + op2;
  
  return {
    op1: op1.toString(),
    op2: op2.toString(),
    result: "_", // Always missing result
    answer: result.toString(),
    operator: "+"
  };
};

export default function AdditionActivity() {
  const [currentProblem, setCurrentProblem] = useState(null);

  useEffect(() => {
    // Generate initial problem
    setCurrentProblem(generateAdditionProblem());
  }, []);

  const generateNewProblem = () => {
    setCurrentProblem(generateAdditionProblem());
  };

  if (!currentProblem) {
    return (
      <ActivityLayout title="Addition">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-lg text-gray-500">Loading problem...</div>
        </div>
      </ActivityLayout>
    );
  }

  return (
    <ActivityLayout title="Addition">
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-center">Addition</h1>
            </div>
          </div>
          
          {/* Current Problem */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex justify-center">
              <ArithmeticInput 
                data={currentProblem} 
                onProblemComplete={generateNewProblem}
              />
            </div>
          </div>

          {/* Next Button */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <div className="flex justify-center">
              <button
                onClick={generateNewProblem}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all text-lg"
              >
                Next Problem →
              </button>
            </div>
          </div>

          <div className="mt-8 text-center pb-6">
            <p className="text-gray-600">
              Solve the addition problem and click Next for a new one!
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 