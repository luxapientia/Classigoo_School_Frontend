'use client';

import { useEffect, useState } from 'react';
import { longVowelsData } from '../common/longVowelsData';
import ActivityLayout from '../common/ActivityLayout';
import ParagraphCanvasComponent from './ParagraphCanvasComponent';
import PictureCanvasComponent from './PictureCanvasComponent';
import { useAudio } from '../hooks/useAudio';
// import img from '../common/img';

export default function LongVowelActivity({ user, vowel }) {
  const [info, setInfo] = useState({});
  const { speak } = useAudio();

  useEffect(() => {
    const temp = longVowelsData.filter(item => item.name === vowel);
    setInfo(temp[0]);
  }, [vowel]);

  if (!info || Object.keys(info).length === 0) {
    return (
      <ActivityLayout user={user}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Loading...</h1>
          </div>
        </div>
      </ActivityLayout>
    );
  }

  return (
    <ActivityLayout title={`Long Vowels: ${vowel.toUpperCase()}`} user={user}>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Reading Passage */}
              <div className="flex-1 flex flex-col justify-start">
                <h5 className="text-gray-500 font-bold text-lg mb-4">Name</h5>
                <div className="bg-gray-50 p-6 rounded-lg border border-green-200 flex-1">
                  <div className="flex items-start mb-4">
                    <img
                      src="/assets/img/symbols/indicator.svg"
                      alt="indicator"
                      className="w-16 mr-4 cursor-pointer flex-shrink-0"
                      onClick={() => speak(info.passageTitle + info.passageContent)}
                    />
                    <h3 className="text-gray-500 font-bold text-lg">
                      Read the passage 3 times. Color all the -{vowel} words.
                    </h3>
                  </div>
                  
                  <h1 className="text-gray-500 font-bold text-2xl mb-4">{info.passageTitle}</h1>
                  <p className="text-gray-500 text-base mb-6 font-['Ink_Free'] leading-relaxed">
                    {info.passageContent}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-4">
                    <div className="flex space-x-4 flex-shrink-0">
                      <img 
                        src="/assets/img/symbols/circleNumber1.svg" 
                        className="w-12 h-12" 
                        alt="circle-number-1"
                      />
                      <img 
                        src="/assets/img/symbols/circleNumber2.svg" 
                        className="w-12 h-12" 
                        alt="circle-number-2"
                      />
                      <img 
                        src="/assets/img/symbols/circleNumber3.svg" 
                        className="w-12 h-12" 
                        alt="circle-number-3"
                      />
                    </div>
                    <h5 
                      className="text-gray-500 font-bold cursor-pointer hover:text-blue-600 text-sm flex-1 text-right"
                      onClick={() => speak("Fill in a circle for each time you read the passage")}
                    >
                      Fill in a circle for each time you read the passage
                    </h5>
                  </div>
                </div>
              </div>

              {/* Right Column - Questions */}
              <div className="flex-1 flex flex-col justify-start">
                <h5 className="text-gray-500 font-bold text-lg mb-4">
                  LONG VOWELS: {vowel.toUpperCase()}
                </h5>
                <div className="bg-gray-50 p-6 rounded-lg border border-green-200 flex-1">
                  <div className="flex items-start mb-4">
                    <img
                      src="/assets/img/symbols/indicator.svg"
                      alt="indicator"
                      className="w-16 mr-4 cursor-pointer flex-shrink-0"
                      onClick={() => speak("Answer the Questions.")}
                    />
                    <h4 className="text-gray-500 font-bold text-lg">Answer The Questions.</h4>
                  </div>
                  
                  {info && info.questions && info.questions.sentence && (
                    <ParagraphCanvasComponent info={info} />
                  )}
                  
                  <div className="mt-6">
                    <div className="flex items-start mb-4">
                      <img
                        src="/assets/img/symbols/indicator.svg"
                        alt="indicator"
                        className="w-16 mr-4 cursor-pointer flex-shrink-0"
                        onClick={() => speak("Write the words to match the pictures")}
                      />
                      <h4 className="text-gray-500 font-bold text-lg">
                        Write the words to match the pictures.
                      </h4>
                    </div>
                    {info && info.questions && info.questions.pictures && (
                      <PictureCanvasComponent info={info} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 