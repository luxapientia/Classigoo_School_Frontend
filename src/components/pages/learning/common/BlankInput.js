'use client';

import { useState, useRef } from 'react';

const rightAnswerAudio = '/assets/sounds/right_answer.mp3';
const wrongAnswerAudio = '/assets/sounds/wrong_answer.mp3';

export default function BlankInput({ no, text, answer }) {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState(''); // '', 'correct', 'wrong'
  const inputRef = useRef(null);

  const playFeedback = async (isCorrect) => {
    const audio = new Audio(isCorrect ? rightAnswerAudio : wrongAnswerAudio);
    try {
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);
    
    if (value.length !== answer.length || !value) {
      setStatus('');
      e.target.style.backgroundColor = 'transparent';
      return;
    }

    if (value === answer.toLowerCase()) {
      setStatus('correct');
      e.target.style.backgroundColor = '#10b981'; // green-500
      playFeedback(true);
    } else {
      setStatus('wrong');
      e.target.style.backgroundColor = '#ef4444'; // red-500
      playFeedback(false);
    }
  };

  const renderText = () => {
    const parts = [];
    let currentText = '';
    
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '_') {
        // Add the text before the blank
        if (currentText) {
          parts.push(<span key={`text-${i}`}>{currentText}</span>);
          currentText = '';
        }
        
        // Add the input field
        parts.push(
          <input
            key={`input-${i}`}
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="inline-block mx-2 px-2 py-1 border-b-2 border-gray-800 bg-transparent text-center min-w-[80px] outline-none transition-colors"
            style={{ fontSize: 'inherit' }}
          />
        );
      } else {
        currentText += text[i];
      }
    }
    
    // Add any remaining text
    if (currentText) {
      parts.push(<span key="text-end">{currentText}</span>);
    }
    
    return parts;
  };

  return (
    <div className="mb-6 p-4">
      <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 leading-relaxed">
        <strong className="text-blue-600">{no}. </strong>
        {renderText()}
      </h3>
    </div>
  );
} 