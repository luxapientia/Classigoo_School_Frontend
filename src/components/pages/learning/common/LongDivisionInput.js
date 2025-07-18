'use client';

import { useState, useEffect } from 'react';

const rightAnswerAudio = '/assets/sounds/right_answer.mp3';
const wrongAnswerAudio = '/assets/sounds/wrong_answer.mp3';

export default function LongDivisionInput({ data }) {
  const [inputAnswer, setInputAnswer] = useState("");
  const [isRight, setIsRight] = useState(false);
  const [complete, setComplete] = useState(false);
  const [divisionSteps, setDivisionSteps] = useState([]);

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

  const handleStepInputChange = (e, expectedValue) => {
    const enteredValue = e.target.value;
    if (enteredValue === expectedValue) {
      e.target.style.backgroundColor = "#00FF00";
    } else if (enteredValue === "") {
      e.target.style.backgroundColor = "#FFFFFF";
    } else {
      e.target.style.backgroundColor = "#FF0000";
    }
  };

  const handleGetSteps = () => {
    let div = parseInt(data.op1);
    let divider = parseInt(data.op2);
    let answer = data.answer;
    let mul = 0;
    let i = 0;
    let remainder = 0;
    let steps = [];
    
    for (i = 0; i < answer.length; i++) {
      if (answer[i] == "0") continue;
      mul = divider * parseInt(answer[i]) * Math.pow(10, answer.length - i - 1);
      remainder = div - mul;
      steps.push({
        div: div,
        mul: mul,
        remainder: remainder,
        divider: divider,
      });
      div -= mul;
    }
    setDivisionSteps(steps);
  };

  useEffect(() => {
    setInputAnswer("X".repeat(data.answer.length));
  }, [data]);

  useEffect(() => {
    handleGetSteps();
  }, []);

  const getAnswerInputStyle = () => {
    let backgroundColor = "#FFFFFF";
    
    if (isRight) {
      backgroundColor = "#00FF00";
    } else if (complete) {
      backgroundColor = "#FF0000";
    }
    
    return {
      backgroundColor: backgroundColor,
      color: "#000000"
    };
  };

  return (
    <div className="m-4 p-4 bg-white border border-gray-300 rounded-lg shadow-lg max-w-4xl">
      {/* Header */}
      <div className="flex w-full h-10 items-center justify-between mb-4">
        <div className="flex w-1/2 items-center justify-center text-center">
          <span className="text-sm font-medium leading-5 text-black">
            Division<br />Problem
          </span>
        </div>
        <div className="flex w-1/2 items-center justify-center text-center">
          <span className="text-sm font-medium leading-5 text-black">
            Show your<br />work
          </span>
        </div>
      </div>

      {/* Main container */}
      <div className="flex gap-6">
        {/* Left side - DMSB method */}
        <div className="flex flex-col items-center">
          {/* DMSB Grid */}
          <div className="grid grid-cols-2 gap-1 mb-4">
            {['D', 'D', 'M', 'M', 'S', 'S', 'B', 'B'].map((letter, index) => (
              <div key={index} className="w-8 h-8 bg-red-400 flex items-center justify-center border border-black">
                <span className="text-white font-bold text-sm">{letter}</span>
              </div>
            ))}
          </div>

          {/* Division layout - Left side */}
          <div className="flex items-end">
            {/* Divisor */}
            <div className="flex">
              {data.op2.split("").map((digit, index) => (
                <div key={index} className="w-12 h-12 flex items-center justify-center text-xl font-bold text-black">
                  {digit}
                </div>
              ))}
            </div>
            
            {/* Dividend with ONLY top and left borders */}
            <div className="flex border-t-4 border-l-4 border-black">
              {data.op1.split("").map((digit, index) => (
                <div key={index} className="w-12 h-12 flex items-center justify-center text-xl font-bold text-black">
                  {digit}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Working area */}
        <div className="flex-1 flex flex-col">
          {/* Answer input row - continuous squares right-aligned */}
          <div className="w-full flex mb-2 justify-end items-center">
            {data.answer.split("").map((digit, index) => (
              <input
                key={index}
                maxLength={1}
                type="text"
                pattern="[0-9]"
                className="w-12 h-12 text-center text-xl font-bold text-black border border-gray-400 focus:border-blue-500 focus:border-2 focus:outline-none"
                style={getAnswerInputStyle()}
                onChange={(e) => handleInputChange(e, index)}
              />
            ))}
          </div>

          {/* Division layout - Right side */}
          <div className="w-full flex mb-4 justify-end items-center">
            {/* Divisor */}
            <div className="flex">
              {data.op2.split("").map((digit, index) => (
                <div key={index} className="w-12 h-12 flex items-center justify-center text-xl font-bold text-black">
                  {digit}
                </div>
              ))}
            </div>
            
            {/* Dividend with ONLY top and left borders */}
            <div className="flex border-t-2 border-l-2 border-black">
              {data.op1.split("").map((digit, index) => (
                <div key={index} className="w-12 h-12 flex items-center justify-center text-xl font-bold text-black">
                  {digit}
                </div>
              ))}
            </div>
          </div>

          {/* Division steps */}
          {divisionSteps.map((step, stepIndex) => (
            <div key={stepIndex} className="flex flex-col w-full mb-2">
              {/* Multiplication row - continuous squares right-aligned */}
              <div className="flex w-full items-center justify-end mb-1">
                {step.mul.toString().split("").map((digit, digitIndex) => {
                  const shouldHide = (step.mul / step.divider).toString().length - 1 > 
                    step.mul.toString().length - digitIndex - 1;
                  
                  return (
                    <div key={digitIndex} className="w-12 h-12 flex items-center justify-center">
                      {!shouldHide ? (
                        <input
                          maxLength={1}
                          type="text"
                          pattern="[0-9]"
                          className="w-full h-full text-center text-xl font-bold text-black bg-white border border-gray-400 focus:border-blue-500 focus:border-2 focus:outline-none"
                          onChange={(e) => handleStepInputChange(e, digit)}
                        />
                      ) : (
                        <div className="w-full h-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Remainder row - continuous squares right-aligned */}
              <div className="flex w-full items-center justify-end">
                {step.remainder.toString().split("").map((digit, digitIndex) => {
                  const shouldHide = (step.remainder / step.divider).toString().length - 1 > 
                    step.remainder.toString().length - digitIndex - 1;
                  
                  return (
                    <div key={digitIndex} className="w-12 h-12 flex items-center justify-center">
                      {!shouldHide ? (
                        <input
                          maxLength={1}
                          type="text"
                          pattern="[0-9]"
                          className="w-full h-full text-center text-xl font-bold text-black bg-white border border-gray-400 focus:border-blue-500 focus:border-2 focus:outline-none"
                          onChange={(e) => handleStepInputChange(e, digit)}
                        />
                      ) : (
                        <div className="w-full h-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 