'use client';

import { useState } from 'react';

const rightAnswerAudio = '/assets/sounds/right_answer.mp3';
const wrongAnswerAudio = '/assets/sounds/wrong_answer.mp3';

export default function ArithmeticInput({ data }) {
  const [isRight, setIsRight] = useState(false);
  const [complete, setComplete] = useState(false);

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
    if (value.length === data.answer.length) {
      setComplete(true);
      if (value === data.answer) {
        playFeedback(true);
        setIsRight(true);
      } else {
        setIsRight(false);
        playFeedback(false);
      }
    } else {
      setComplete(false);
      setIsRight(false);
    }
  };

  const getCardStyle = () => {
    const baseClasses = "flex flex-col items-center min-w-[200px] h-[280px] m-4 rounded-xl text-4xl font-bold transition-all duration-500 cursor-pointer shadow-lg";
    
    switch (data.operator) {
      case '+':
        return `${baseClasses} bg-gradient-to-b from-red-400 via-red-400 to-white text-blue-900 hover:bg-red-400 hover:text-white hover:text-5xl active:bg-purple-500 active:text-black`;
      case '-':
        return `${baseClasses} bg-gradient-to-b from-orange-400 via-orange-400 to-white text-blue-900 hover:bg-blue-500 hover:text-white hover:text-5xl active:bg-blue-400 active:text-black`;
      case '*':
        return `${baseClasses} bg-gradient-to-b from-purple-500 via-orange-400 to-white text-blue-900 hover:bg-blue-500 hover:text-white hover:text-5xl active:bg-blue-400 active:text-black`;
      case '/':
        return `${baseClasses} bg-gradient-to-b from-orange-400 via-orange-400 to-white text-blue-900 hover:bg-blue-500 hover:text-white hover:text-5xl active:bg-blue-400 active:text-black`;
      default:
        return `${baseClasses} bg-gradient-to-b from-red-400 via-red-400 to-white text-blue-900`;
    }
  };

  const getInputBgColor = () => {
    if (isRight) return '#00FF00';
    if (complete) return '#FF0000';
    return '#FFFFFF';
  };

  return (
    <div className={getCardStyle()}>
      <div className="w-full h-[140px] flex flex-col justify-center">
        {data.op1 === "_" ? (
          <div className="flex justify-center items-center w-full h-[70px]">
            <input
              type="text"
              pattern="[0-9]*"
              className="w-[150px] h-[60px] text-4xl text-center border-none rounded-xl"
              style={{ backgroundColor: getInputBgColor(), color: "black" }}
              onChange={handleInputChange}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center w-full h-[70px]">
            <span className="text-4xl font-bold">{data.op1}</span>
          </div>
        )}

        {data.op2 === "_" ? (
          <div className="flex justify-center items-center w-full">
            <span className="text-4xl font-bold mr-2">{data.operator}</span>
            <input
              type="text"
              pattern="[0-9]*"
              className="w-[150px] h-[60px] text-4xl text-center border-none rounded-xl"
              style={{ backgroundColor: getInputBgColor(), color: "black" }}
              onChange={handleInputChange}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center w-full relative">
            <span className="text-4xl font-bold absolute left-10">{data.operator}</span>
            <span className="text-4xl font-bold">{data.op2}</span>
          </div>
        )}
      </div>

      {data.result === "_" ? (
        <div className="flex justify-center items-center w-full mt-8">
          <input
            type="text"
            pattern="[0-9]*"
            className="w-[150px] h-[60px] text-4xl text-center border-none rounded-xl"
            style={{ backgroundColor: getInputBgColor(), color: "black" }}
            onChange={handleInputChange}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center w-full mt-8">
          <span className="text-4xl font-bold">{data.result}</span>
        </div>
      )}
    </div>
  );
} 