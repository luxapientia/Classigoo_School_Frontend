"use client";
import { useState } from "react";
import LearningScreenActivityLayout from "@components/pages/learning/learning-screen/LearningScreenActivityLayout";
import completeWordData from "@components/pages/learning/common/completeWordData";
import Image from "next/image";

export default function CompleteWord() {
  const data = completeWordData;
  const [imageVisible, setImageVisible] = useState(false);
  const [imageName, setImageName] = useState("yes");
  const [currentindex, setcurrentindex] = useState(0);

  const checkWord = (word) => {
    if (word === data[currentindex].rightanswer) {
      setImageName("yes");
    } else setImageName("no");
    setImageVisible(true);
    setTimeout(() => {
      setImageVisible(false);
      let randomIndex = -1;
      do {
        randomIndex = Math.floor(Math.random() * data.length);
      } while (randomIndex === currentindex);
      setcurrentindex(randomIndex);
    }, 1000);
  };

  // Helper to render the sentence with the missing part styled
  const renderSentence = () => {
    const { sentence, rightanswer } = data[currentindex];
    // Find the word containing the rightanswer
    return (
      <span className="text-lg md:text-xl text-gray-900">
        {sentence.split(" ").map((word, index) => {
          if (word.includes(rightanswer)) {
            const parts = word.split(rightanswer);
            return (
              <span key={index}>
                {parts[0]}
                <span className="underline decoration-dashed text-red-600 font-bold text-2xl md:text-3xl mx-1">
                  {"_".repeat(rightanswer.length)}
                </span>
                {/* <span className="text-red-600 font-bold text-2xl md:text-3xl mx-1">
                  {rightanswer}
                </span> */}
                {parts[1]}
                {index !== sentence.split(" ").length - 1 && " "}
              </span>
            );
          } else {
            return (
              <span key={index}>
                {word}
                {index !== sentence.split(" ").length - 1 && " "}
              </span>
            );
          }
        })}
      </span>
    );
  };

  return (
    <LearningScreenActivityLayout title="Complete Word" currentIndex={1} backgroundIndex={1}>
      {imageVisible && (
        <div className="flex w-full justify-center items-center absolute left-0 right-0 top-0 z-20">
          <Image
            src={`/assets/img/screen/${imageName}.png`}
            alt={imageName}
            width={100}
            height={100}
            className="w-auto h-auto"
          />
        </div>
      )}
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-8 mt-4 drop-shadow bg-white bg-opacity-90 rounded-xl px-6 py-2 text-red-700">
          Click the missing part of word to complete the sentence.
        </h1>
        <div className="bg-white rounded-xl shadow-lg px-6 py-8 max-w-2xl w-full flex flex-col items-center">
          <div className="mb-6 text-center">
            {renderSentence()}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 mt-2">
            {data[currentindex].answers.split(",").map((item, index) => (
              <button
                key={index}
                onClick={() => checkWord(item)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-8 rounded-lg shadow transition-colors text-lg min-w-[100px]"
                style={{ height: 48 }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </LearningScreenActivityLayout>
  );
} 