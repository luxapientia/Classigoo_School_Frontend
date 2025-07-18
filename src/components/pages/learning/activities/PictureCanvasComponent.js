'use client';

import { createRef, useEffect } from 'react';
import HandWritingCanvas from '../common/HandWritingCanvas';
import { useAudio } from '../hooks/useAudio';

let limited_letters = 250;
let mouse_trace_data = new Array(limited_letters);
let pictureStartIndex = 10;

export default function PictureCanvasComponent({ info }) {
  const handWritingCanvasRefs = [...Array(limited_letters)].map(() => createRef());
  const pictureCanvasWrapperRef = createRef();
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
    if (handWritingCanvasRefs[pictureStartIndex].current) {
      if (info) {
        for (let i = 0; i < info.questions.pictures.length; i++) {
          handWritingCanvasRefs[pictureStartIndex + i].current.setCanvasWidth(pictureCanvasWrapperRef.current.clientWidth);
        }
      }
    }
  }, [info]);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {info.questions.pictures.map((picture, pictureIndex) => (
          <div key={pictureIndex} className="flex flex-col items-center">
            <div className="flex flex-col justify-center items-center mt-3">
              <img 
                src={picture.src} 
                className="h-12 mb-2" 
                alt="picture"
              />
              <div 
                className="border-t-2 border-b-2 border-black relative h-20 w-full"
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
                <div className="canvas-wrapper" ref={pictureCanvasWrapperRef}>
                  <div className="handwriting-canvas">
                    <HandWritingCanvas
                      ref={handWritingCanvasRefs[pictureStartIndex + pictureIndex]}
                      init_trace={mouse_trace_data[pictureStartIndex + pictureIndex]}
                      onCheck={onCheck}
                      onDrawStart={() => {
                        SetActiveCanvas(pictureStartIndex + pictureIndex);
                      }}
                      onDrawEnd={(data) => {
                        mouse_trace_data[pictureStartIndex + pictureIndex] = data;
                      }}
                      onErase={() => {
                        mouse_trace_data[pictureStartIndex + pictureIndex] = undefined;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 