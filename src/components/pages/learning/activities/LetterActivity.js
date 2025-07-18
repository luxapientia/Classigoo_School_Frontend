'use client';

import { useState, useEffect, createRef } from 'react';
import ActivityLayout from '../common/ActivityLayout';
import letterData from '../common/letterData';
import HandWritingCanvas from '../common/HandWritingCanvas';
import { useAudio } from '../hooks/useAudio';
import ImageButton from '../common/ImageButton';
import styles from '../common/LetterActivity.module.css';

export default function LetterActivity({ letter, user }) {
  const [currentLetterData, setCurrentLetterData] = useState(null);
  const handWritingCanvasRefs = [...Array(4)].map(() => createRef());
  const canvasWrapperRef = createRef();
  let mouse_trace_data = new Array(4);
  const { speak } = useAudio();

  useEffect(() => {
    if (letter && letterData[letter]) {
      setCurrentLetterData(letterData[letter]);
    }
  }, [letter]);

  useEffect(() => {
    mouse_trace_data = new Array(4);
    if (handWritingCanvasRefs[0].current) {
      let canvas1Width = canvasWrapperRef.current.clientWidth - handWritingCanvasRefs[0].current.getCanvasWidth();
      let canvas3Width = canvasWrapperRef.current.clientWidth - handWritingCanvasRefs[2].current.getCanvasWidth();
      handWritingCanvasRefs[1].current.setCanvasWidth(canvas1Width);
      handWritingCanvasRefs[3].current.setCanvasWidth(canvas3Width);
    }
  }, [currentLetterData]);

  if (!currentLetterData) {
    return (
      <ActivityLayout title="Letter Not Found" user={user}>
        <div className="text-center py-8">
          <p>Letter not found. Please go back to the alphabet.</p>
        </div>
      </ActivityLayout>
    );
  }

  const titleLetter = letter.toUpperCase() + letter;

  function onCheck(data, err) {
    console.log(data, err);
    if (err) {
      // Handle error
    } else {
      console.log(data[0]);
      for (var i = 0; i < data[0].length; i++)
        speak(data[0][i], 0.6);
    }
  }

  function SetActiveCanvas(index) {
    for (var i = 0; i < handWritingCanvasRefs.length; i++) {
      if (handWritingCanvasRefs[i].current == null)
        continue;
      if (i === index)
        handWritingCanvasRefs[i].current.showControlBtn();
      else
        handWritingCanvasRefs[i].current.hideControlBtn();
    }
  }

  // function speak(text) {
  //   // Speech synthesis implementation
  //   console.log(`Speaking: ${text}`);
  // }

  return (
    <ActivityLayout title={`Letter ${letter.toUpperCase()}`} user={user}>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className={styles.letterContainer}>
          {/* Title */}
          <h1 className={styles.title}>
            <span>The Letter </span>
            <span>{titleLetter}</span>
          </h1>

          {/* Main content area - Trace and Examples side by side */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* Left side - Tracing area */}
            <div className="lg:w-1/2">
              <div className={styles.traceLetter}>
                <p>Trace The Letter</p>
                <div 
                  className={styles.traceLetterImageWrapper}
                  style={{ backgroundColor: currentLetterData.backgroundColor }}
                >
                  <img 
                    src={`/assets/images/${currentLetterData.letterImage}`} 
                    alt={`Letter ${letter}`}
                  />
                </div>
              </div>
            </div>

            {/* Right side - Word examples */}
            <div className="lg:w-1/2">
              <div className={styles.typicalLetterContent}>
                <img 
                  src={`/assets/images/${currentLetterData.backgroundImage}`} 
                  alt="Background"
                />
                
                {/* Word examples positioned absolutely */}
                {currentLetterData.examples.map((example, index) => (
                  <div 
                    key={index}
                    className={styles.imageBtnWrapper}
                    style={example.style}
                    onClick={() => speak(example.word, 0.6)}
                  >
                    <img 
                      src={`/assets/images/${example.image}`} 
                      alt={example.word}
                      style={{ width: example.style.width || 'auto' }}
                    />
                    <div className="text-center mt-1">
                      <span className="text-red-500 font-bold">{example.word.charAt(0)}</span>
                      <span className="text-black">{example.word.slice(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Handwriting practice area - Uppercase */}
          <div className={styles.dottedBox}>
            <img 
              src={`/assets/images/${currentLetterData.letterUpImage}`} 
              alt="Uppercase letter"
              className={styles.bigLetter}
            />
            <div className={`${styles.bigCanvas} ${styles.canvasWrapper}`} ref={canvasWrapperRef}>
              <div className="flex h-full">
                <div className={styles.handwritingCanvas}>
                  <HandWritingCanvas 
                    ref={handWritingCanvasRefs[0]} 
                    init_trace={mouse_trace_data[0]}
                    onCheck={onCheck}
                    onDrawStart={() => SetActiveCanvas(0)}
                    onDrawEnd={(data) => {
                      mouse_trace_data[0] = data;
                    }}
                    onErase={() => {
                      mouse_trace_data[0] = undefined;
                    }}
                  />
                </div>
                <div className={`${styles.handwritingCanvas} flex-1`}>
                  <HandWritingCanvas 
                    ref={handWritingCanvasRefs[1]} 
                    init_trace={mouse_trace_data[1]}
                    onCheck={onCheck}
                    onDrawStart={() => SetActiveCanvas(1)}
                    onDrawEnd={(data) => {
                      mouse_trace_data[1] = data;
                    }}
                    onErase={() => {
                      mouse_trace_data[1] = undefined;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Handwriting practice area - Lowercase */}
          <div className={styles.dottedBox}>
            <img 
              src={`/assets/images/${currentLetterData.letterDownImage}`} 
              alt="Lowercase letter"
              className={styles.smallLetter}
              style={{width: "64px", height: "35px"}}
            />
            <div className={styles.canvasWrapper}>
              <div className="flex h-full">
                <div className={styles.handwritingCanvas}>
                  <HandWritingCanvas 
                    ref={handWritingCanvasRefs[2]}
                    init_trace={mouse_trace_data[2]} 
                    onCheck={onCheck} 
                    onDrawStart={() => SetActiveCanvas(2)}
                    onDrawEnd={(data) => {
                      mouse_trace_data[2] = data;
                    }}
                  />
                </div>
                <div className={`${styles.handwritingCanvas} flex-1`}>
                  <HandWritingCanvas 
                    ref={handWritingCanvasRefs[3]}
                    init_trace={mouse_trace_data[3]} 
                    onCheck={onCheck} 
                    onDrawStart={() => SetActiveCanvas(3)}
                    onDrawEnd={(data) => {
                      mouse_trace_data[3] = data;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Video section */}
          <div className={styles.footer}>
            <video 
              width="100%" 
              height="auto" 
              controls 
              className="rounded-lg"
            >
              <source 
                src={`/assets/images/${currentLetterData.video}`} 
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 