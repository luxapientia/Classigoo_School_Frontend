'use client';

import { createRef, useEffect } from 'react';
import HandWritingCanvas from '../common/HandWritingCanvas';
import { useAudio } from '../hooks/useAudio';

let limited_letters = 250;
let mouse_trace_data = new Array(limited_letters);

export default function ParagraphCanvasComponent({ info }) {
  const handWritingCanvasRefs = [...Array(limited_letters)].map(() => createRef());
  const canvasWrapperRef = createRef();
  const { speak } = useAudio();

  function onCheck(data, err) {
    if (err) {
      console.error('Check error:', err);
    } else {
      console.log(data[0]);
      for (let i = 0; i < data[0].length; i++) {
        speak(data[0][i], 0.6);
      }
    }
  }

  function SetActiveCanvas(index) {
    for (let i = 0; i < handWritingCanvasRefs.length; i++) {
      if (handWritingCanvasRefs[i].current == null) continue;
      if (i === index) {
        handWritingCanvasRefs[i].current.showControlBtn();
      } else {
        handWritingCanvasRefs[i].current.hideControlBtn();
      }
    }
  }

  useEffect(() => {
    mouse_trace_data = new Array(limited_letters);
    if (handWritingCanvasRefs[0].current) {
      if (info) {
        for (let i = 0; i < info.questions.sentence.length; i++) {
          for (let j = 0; j < info.questions.sentence[i].lines; j++) {
            handWritingCanvasRefs[i * 5 + j].current.setCanvasWidth(canvasWrapperRef.current.clientWidth);
          }
        }
      }
    }
  }, [info]);

  return (
    <div>
      {info.questions.sentence.map((question, questionIndex) => (
        <div key={questionIndex} className="mb-8">
          <h5 
            className="text-gray-500 font-normal text-lg mb-4 cursor-pointer hover:text-blue-600"
            onClick={() => speak(question.title)}
          >
            {`${questionIndex + 1}. ` + question.title}
          </h5>
          {[...Array(question.lines)].map((line, lineIndex) => (
            <div 
              key={lineIndex} 
              className="mb-6 border-t-2 border-b-2 border-black relative h-20"
              style={{
                '--canvas-margin': '20px'
              }}
            >
              <div 
                className="absolute top-1/2 w-full h-0.5"
                style={{
                  backgroundImage: 'linear-gradient(to right, #ef1183 50%, white 50%)',
                  backgroundPosition: 'top',
                  backgroundSize: '20px 2px'
                }}
              />
              <div className="canvas-wrapper" ref={canvasWrapperRef}>
                <div className="handwriting-canvas">
                  <HandWritingCanvas
                    ref={handWritingCanvasRefs[questionIndex * 5 + lineIndex]}
                    init_trace={mouse_trace_data[questionIndex * 5 + lineIndex]}
                    onCheck={onCheck}
                    onDrawStart={() => {
                      SetActiveCanvas(questionIndex * 5 + lineIndex);
                    }}
                    onDrawEnd={(data) => {
                      mouse_trace_data[questionIndex * 5 + lineIndex] = data;
                    }}
                    onErase={() => {
                      mouse_trace_data[questionIndex * 5 + lineIndex] = undefined;
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
} 