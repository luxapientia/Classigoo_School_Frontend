'use client';

import { useState, useEffect } from 'react';

const rightAnswerAudio = '/assets/sounds/right_answer.mp3';
const wrongAnswerAudio = '/assets/sounds/wrong_answer.mp3';

export default function Arithmetic2Input({ data }) {
  const [inputAnswer, setInputAnswer] = useState("");
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

  const handleInputChange = (e, index) => {
    const inputArray = inputAnswer.split("");
    inputArray[index] = e.target.value;
    const updatedInputAnswer = inputArray.join("");
    
    // Only check answer and play sound when all digits are filled
    if (updatedInputAnswer.length === data.answer.length && !updatedInputAnswer.includes("X")) {
      setComplete(true);
      if (updatedInputAnswer === data.answer) {
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
    setInputAnswer(updatedInputAnswer);
  };

  useEffect(() => {
    setInputAnswer("X".repeat(data.answer.length));
  }, [data]);

  const getCardStyle = () => {
    const baseClasses = "flex flex-col items-center min-w-[250px] h-[300px] m-4 text-4xl font-bold text-blue-900 shadow-lg transition-all duration-500 cursor-pointer";
    
    switch (data.operator) {
      case '+':
        return `${baseClasses} bg-sky-400 hover:text-5xl`;
      case '-':
        return `${baseClasses} bg-green-400 hover:text-5xl`;
      case '*':
        return `${baseClasses} bg-purple-400 hover:text-5xl`;
      case '/':
        return `${baseClasses} bg-orange-400 hover:text-5xl`;
      default:
        return `${baseClasses} bg-sky-400`;
    }
  };

  const getInputBgColor = () => {
    if (isRight) return '#00FF00';
    if (complete) return '#EE2222';
    return '#FFFFFF';
  };

  const renderDigits = (value, isInput = false) => {
    if (isInput) {
      return data.answer.split("").map((item, index) => (
        <input
          key={index}
          maxLength={1}
          type="text"
          pattern="[0-9]*"
          className="w-12 h-12 ml-2 text-4xl text-center border border-gray-400"
          style={{ backgroundColor: getInputBgColor(), color: "black" }}
          onChange={(e) => handleInputChange(e, index)}
        />
      ));
    } else {
      return value.split("").map((item, index) => (
        <span key={index} className="w-12 h-12 ml-2 text-4xl text-center inline-block">
          {item}
        </span>
      ));
    }
  };

  return (
    <div className={getCardStyle()}>
      {data.op1 === "_" ? (
        <div className="flex w-full h-12 mt-5 pr-5 justify-end items-end">
          {renderDigits("", true)}
        </div>
      ) : (
        <div className="flex w-full h-12 mt-5 pr-5 justify-end items-end">
          {renderDigits(data.op1)}
        </div>
      )}

      {data.op2 === "_" ? (
        <div className="flex w-full h-12 mt-5 pr-5 justify-end items-end">
          <span className="w-12 h-12 ml-2 text-4xl mr-auto">{data.operator}</span>
          {renderDigits("", true)}
        </div>
      ) : (
        <div className="flex w-full h-12 mt-5 pr-5 justify-end items-end">
          <span className="w-12 h-12 ml-2 left-5 text-4xl mr-auto">{data.operator}</span>
          {renderDigits(data.op2)}
        </div>
      )}

      <div className="border-t-2 border-black border-opacity-25 w-[90%] mt-5"></div>

      {data.result === "_" ? (
        <div className="flex w-full h-12 mt-5 pr-5 justify-end items-end">
          {renderDigits("", true)}
        </div>
      ) : (
        <div className="flex w-full h-12 mt-5 pr-5 justify-end items-end">
          {renderDigits(data.result)}
        </div>
      )}
    </div>
  );
} 