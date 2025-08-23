"use client";
import { useState } from "react";

export default function ExamConfigModal({ isOpen, onClose, onStartExam }) {
  const [questionCount, setQuestionCount] = useState(20);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [examTime, setExamTime] = useState(30);

  const handleStartExam = () => {
    onStartExam({
      questionCount,
      timerEnabled,
      examTime: timerEnabled ? examTime : null
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
          Configure Your Exam
        </h2>
        
        {/* Question Count Selection */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-700">Number of Questions</h3>
          <div className="grid grid-cols-2 sm:flex sm:gap-3 gap-2">
            {[10, 20, 35, 50].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                  questionCount === count
                    ? "bg-pink-600 text-white shadow-lg"
                    : "bg-pink-200 text-pink-800 hover:bg-pink-300"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Timer Options */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-700">Timer</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              onClick={() => setTimerEnabled(false)}
              className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                !timerEnabled
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-pink-200 text-pink-800 hover:bg-pink-300"
              }`}
            >
              Timer Off
            </button>
            <button
              onClick={() => setTimerEnabled(true)}
              className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                timerEnabled
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-pink-200 text-pink-800 hover:bg-pink-300"
              }`}
            >
              Timer On
            </button>
          </div>
        </div>

        {/* Exam Time Selection (only if timer is enabled) */}
        {timerEnabled && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-700">Exam Time (minutes)</h3>
            <div className="grid grid-cols-2 sm:flex sm:gap-3 gap-2">
              {[15, 30, 45, 60].map((time) => (
                <button
                  key={time}
                  onClick={() => setExamTime(time)}
                  className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    examTime === time
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-blue-200 text-blue-800 hover:bg-blue-300"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-center text-gray-700 font-medium text-sm sm:text-base">
            {questionCount} Questions Selected & Timer {timerEnabled ? `ON (${examTime} min)` : 'OFF'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleStartExam}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
} 