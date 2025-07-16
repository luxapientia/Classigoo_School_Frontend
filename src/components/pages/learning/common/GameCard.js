'use client';

import { useState, useRef, useEffect } from 'react';
import { useAudio } from '../hooks/useAudio';

const rightAnswerAudio = '/assets/sounds/right_answer.mp3';
const wrongAnswerAudio = '/assets/sounds/wrong_answer.mp3';

export default function GameCard({ 
  text, 
  isBlank = false,
  expectedValue,
  onClick,
  className = '',
  resetKey = 0, // Add this prop to trigger reset
}) {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState(''); // '', 'correct', 'wrong'
  const inputRef = useRef(null);
  const { speak } = useAudio();

  // Reset the input value and status when resetKey changes
  useEffect(() => {
    setInputValue('');
    setStatus('');
  }, [resetKey]);

  const playFeedback = async (isCorrect) => {
    const audio = new Audio(isCorrect ? rightAnswerAudio : wrongAnswerAudio);
    try {
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleInputChange = (e) => {
    // Convert to uppercase and take only the first character
    const value = e.target.value.toUpperCase().slice(0, 1);
    setInputValue(value);
    
    if (!value) {
      setStatus('');
      return;
    }

    if (value === expectedValue?.toUpperCase()) {
      setStatus('correct');
      playFeedback(true);
    } else {
      setStatus('wrong');
      playFeedback(false);
    }
  };

  const handleDisplayClick = () => {
    if (onClick) {
      onClick();
    }
    if (text) {
      speak(text);
    }
  };

  return (
    <div
      className={`
        aspect-square w-full rounded-lg 
        bg-rose-400
        flex items-center justify-center
        transition-all transform hover:scale-[1.02]
        relative overflow-hidden shadow-md hover:shadow-lg
        p-2
        ${className}
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center p-6">
        {isBlank ? (
          <div className={`
            aspect-square w-full
            ${status === 'correct' ? 'bg-green-500' : 
              status === 'wrong' ? 'bg-yellow-400' : 
              'bg-white'}
            flex items-center justify-center
            rounded-sm
          `}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              maxLength="1"
              className={`
                w-full h-full text-center bg-transparent
                outline-none border-none
                text-2xl md:text-3xl font-serif font-bold
                ${status === 'correct' ? 'text-white' :
                  status === 'wrong' ? 'text-black' :
                  'text-blue-900'}
              `}
              onChange={handleInputChange}
              style={{ textTransform: 'uppercase' }}
            />
          </div>
        ) : (
          <button
            onClick={handleDisplayClick}
            className="w-full h-full flex items-center justify-center"
          >
            <span className="text-2xl md:text-3xl font-serif font-bold text-blue-900">
              {text?.toUpperCase()}
            </span>
          </button>
        )}
      </div>
      
      {/* Red corner triangle */}
      <div className="absolute bottom-0 left-0">
        <div className="w-6 h-6 bg-rose-400 transform rotate-45 translate-y-3 -translate-x-3" />
      </div>
    </div>
  );
}
