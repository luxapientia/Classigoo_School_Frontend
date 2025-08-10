"use client";
import { useState, useEffect } from "react";

export default function CountdownTimer({ initialTime, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(initialTime * 60); // Convert to seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 300) return "text-red-600"; // Last 5 minutes
    if (timeLeft <= 600) return "text-orange-600"; // Last 10 minutes
    return "text-blue-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-200">
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-700 mb-2">Time Remaining</h3>
        <div className={`text-3xl font-mono font-bold ${getTimeColor()}`}>
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
} 