"use client";
import { useState } from "react";
import LearningScreenActivityLayout from "@components/pages/learning/learning-screen/LearningScreenActivityLayout";
import matchingWordData from "@components/pages/learning/common/matchingWordData";
import Image from "next/image";

export default function MatchingWordSelect() {
  const data = matchingWordData;
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

  return (
    <LearningScreenActivityLayout title="Matching Words" currentIndex={0} backgroundIndex={0}>
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
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center mb-8 mt-4 drop-shadow">
          Click the word or phrase that means the same thing as the underlined word.
        </h1>
        <div className="bg-white rounded-xl shadow-lg px-6 py-8 max-w-2xl w-full flex flex-col items-center">
          <div className="mb-6 text-center">
            <span className="text-lg md:text-xl text-gray-900">
              {data[currentindex].sentence.split(" ").map((word, index) => (
                <span key={index}>
                  {word === data[currentindex].underlineword ? (
                    <span className="underline decoration-dashed text-red-600 font-bold text-2xl md:text-3xl mx-1">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                  {index !== data[currentindex].sentence.split(" ").length - 1 && " "}
                </span>
              ))}
            </span>
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