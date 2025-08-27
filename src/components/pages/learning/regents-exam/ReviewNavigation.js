"use client";
import React, { useState } from "react";

export default function ReviewNavigation({ 
  currentIndex, 
  totalQuestions, 
  onPrevious, 
  onNext, 
  canGoPrevious, 
  canGoNext,
  onJumpToQuestion // New prop for jumping to specific question
}) {
  const [inputValue, setInputValue] = useState(currentIndex + 1);
  const [isEditing, setIsEditing] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  // Handle input submission
  const handleInputSubmit = (e) => {
    e.preventDefault();
    const questionNumber = parseInt(inputValue);
    
    if (questionNumber >= 1 && questionNumber <= totalQuestions) {
      onJumpToQuestion(questionNumber - 1); // Convert to 0-based index
      setIsEditing(false);
    } else {
      // Reset to current value if invalid
      setInputValue(currentIndex + 1);
      setIsEditing(false);
    }
  };

  // Handle input blur (when user clicks away)
  const handleInputBlur = () => {
    setIsEditing(false);
    setInputValue(currentIndex + 1); // Reset to current value
  };

  // Handle input key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleInputSubmit(e);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(currentIndex + 1);
    }
  };

  // Update input value when currentIndex changes
  React.useEffect(() => {
    setInputValue(currentIndex + 1);
  }, [currentIndex]);

  return (
    <div className="bg-white bg-opacity-50 rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            canGoPrevious
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        {/* Current Position with Editable Input */}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            {isEditing ? (
              <form onSubmit={handleInputSubmit} className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max={totalQuestions}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  className="w-28 text-center text-2xl font-bold text-white border-2 border-blue-500 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  autoFocus
                />
                <span className="text-2xl font-bold text-gray-800">of {totalQuestions}</span>
                <button
                  type="submit"
                  className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Go
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-center hover:bg-blue-50 rounded-lg p-2 transition-colors group"
              >
                <div className="text-2xl font-bold text-gray-800 group-hover:text-blue-600">
                  {currentIndex + 1} of {totalQuestions}
                </div>
                <div className="text-sm text-gray-500 group-hover:text-blue-500">
                  Click to edit • Questions
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            canGoNext
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>Next</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Start</span>
          <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Complete</span>
          <span>End</span>
        </div>
      </div>
    </div>
  );
} 