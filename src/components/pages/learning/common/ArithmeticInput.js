'use client';

import { useState, useEffect } from 'react';

const rightAnswerAudio = '/assets/sounds/right_answer.mp3';
const wrongAnswerAudio = '/assets/sounds/wrong_answer.mp3';

export default function ArithmeticInput({ data, onProblemComplete }) {
  const [userInput, setUserInput] = useState('');
  const [isRight, setIsRight] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Reset state when data changes
  useEffect(() => {
    setUserInput('');
    setIsRight(false);
    setShowFeedback(false);
  }, [data]);

  const playFeedback = async (isCorrect) => {
    const audio = new Audio(isCorrect ? rightAnswerAudio : wrongAnswerAudio);
    try {
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    setUserInput(value);
    
    // Check if answer is complete and correct
    if (value === data.answer) {
      setIsRight(true);
      setShowFeedback(true);
      playFeedback(true);
      
      // Auto-advance to next problem after 1.5 seconds
      setTimeout(() => {
        if (onProblemComplete) {
          onProblemComplete();
        }
      }, 1500);
    } else if (value.length === data.answer.length && value !== data.answer) {
      // Wrong answer when input length matches expected length
      setIsRight(false);
      setShowFeedback(true);
      playFeedback(false);
      
      // Clear feedback after 2 seconds
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    } else {
      // Still typing or incomplete
      setShowFeedback(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userInput.length > 0) {
      // Check answer on Enter key
      if (userInput === data.answer) {
        setIsRight(true);
        setShowFeedback(true);
        playFeedback(true);
        
        // Auto-advance to next problem after 1.5 seconds
        setTimeout(() => {
          if (onProblemComplete) {
            onProblemComplete();
          }
        }, 1500);
      } else {
        setIsRight(false);
        setShowFeedback(true);
        playFeedback(false);
        
        // Clear feedback after 2 seconds
        setTimeout(() => {
          setShowFeedback(false);
        }, 2000);
      }
    }
  };

  const getCardStyle = () => {
    return "flex flex-col items-center min-w-[400px] h-[450px] m-4 rounded-xl text-4xl font-bold transition-all duration-500 cursor-pointer shadow-lg bg-gradient-to-b from-red-400 via-red-400 to-white text-blue-900 hover:bg-red-400 hover:text-white hover:text-5xl active:bg-purple-500 active:text-black";
  };

  const getInputStyle = () => {
    if (showFeedback) {
      return isRight 
        ? 'bg-green-500 text-white border-green-600' 
        : 'bg-red-500 text-white border-red-600';
    }
    return 'bg-white text-black border-gray-300';
  };

  // Calculate the spacing needed for proper operator alignment
  const getOperatorSpacing = () => {
    const op1Length = data.op1.length;
    const op2Length = data.op2.length;
    
    if (op1Length >= op2Length) {
      // First operand is longer or equal - no extra spacing needed
      return 0;
    } else {
      // Second operand is longer - need spacing to align operator with first digit of op2
      return op2Length - op1Length;
    }
  };

  // Get the width for the equals line based on the longer operand
  const getEqualsLineWidth = () => {
    const maxLength = Math.max(data.op1.length, data.op2.length);
    return maxLength * 40; // Approximate width per digit
  };

  return (
    <div className={getCardStyle()}>
      {/* Problem Display with Perfect Column Alignment */}
      <div className="w-full h-[320px] flex flex-col justify-center items-center">
        {/* Column Arithmetic Layout */}
        <div className="w-full max-w-[320px]">
          {/* First Operand - Right Aligned */}
          <div className="flex justify-end items-center w-full h-[80px] mb-2">
            <span className="text-5xl font-bold">{data.op1}</span>
          </div>
          
          {/* Operator and Second Operand - Properly Positioned */}
          <div className="flex justify-end items-center w-full h-[80px] mb-2">
            <div className="flex items-center">
              {/* Add spacing if second operand is longer */}
              {getOperatorSpacing() > 0 && (
                <div className="mr-2" style={{ width: `${getOperatorSpacing() * 20}px` }}></div>
              )}
              <span className="text-5xl font-bold mr-6">{data.operator}</span>
              <span className="text-5xl font-bold">{data.op2}</span>
            </div>
          </div>
          
          {/* Equals Line - Aligned with the longer operand */}
          <div className="flex justify-end mb-4">
            <div 
              className="border-b-4 border-blue-900" 
              style={{ width: `${getEqualsLineWidth()}px` }}
            ></div>
          </div>
          
          {/* Result Input - Aligned with the longer operand */}
          <div className="flex justify-end items-center w-full h-[80px]">
            <input
              type="text"
              pattern="[0-9]*"
              value={userInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={`w-[120px] h-[70px] text-5xl text-center border-2 rounded-xl transition-all duration-300 ${getInputStyle()}`}
              placeholder="?"
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="w-full h-[80px] flex flex-col justify-center items-center">
        {showFeedback && (
          <div className={`text-center ${isRight ? 'text-green-600' : 'text-red-600'}`}>
            <div className="text-3xl font-bold mb-2">
              {isRight ? '✓ Correct!' : '✗ Try Again'}
            </div>
            {!isRight && (
              <div className="text-xl">
                Answer: <span className="font-bold">{data.answer}</span>
              </div>
            )}
          </div>
        )}
        
        {!showFeedback && (
          <div className="text-center text-gray-600">
            <div className="text-lg">Type your answer and press Enter</div>
          </div>
        )}
      </div>

      {/* Simple Instructions */}
      <div className="w-full px-4 pb-4">
        <div className="text-center text-sm text-gray-500">
          Press Enter to check your answer
        </div>
      </div>
    </div>
  );
} 