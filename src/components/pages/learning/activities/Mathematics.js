"use client";
import { useState } from "react";
import LearningScreenActivityLayout from "@components/pages/learning/learning-screen/LearningScreenActivityLayout";
import mathematicsData from "@components/pages/learning/common/mathematicsData";
import Image from "next/image";

export default function Mathematics() {
  const data = mathematicsData;
  const [imageVisible, setImageVisible] = useState(false);
  const [imageName, setImageName] = useState("yes");
  const [inputValue, setInputValue] = useState("");
  const [currentindex, setcurrentindex] = useState(0);

  const handleChangeEvent = (event) => {
    setInputValue(event.target.value);
    if (event.target.value.length === data[currentindex].rightanswer.length) {
      if (event.target.value === data[currentindex].rightanswer) {
        setImageVisible(true);
        setImageName("yes");
        setTimeout(() => {
          setImageVisible(false);
          setInputValue("");
          let randomIndex = -1;
          do {
            randomIndex = Math.floor(Math.random() * data.length);
          } while (randomIndex === currentindex);
          setcurrentindex(randomIndex);
        }, 1000);
      } else {
        setImageVisible(true);
        setImageName("no");
        setTimeout(() => {
          setImageVisible(false);
          setInputValue("");
        }, 1000);
      }
    }
  };

  return (
    <LearningScreenActivityLayout title="Mathematics" currentIndex={6} backgroundIndex={6}>
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
          Input correct answer.
        </h1>
        <div className="bg-white rounded-xl shadow-lg px-6 py-8 max-w-2xl w-full flex flex-col items-center">
          <div className="mb-6 text-center">
            <span className="text-5xl font-bold text-gray-900">
              {data[currentindex].sentence}
              <input
                type="text"
                value={inputValue}
                className="w-24 h-16 text-5xl border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 ml-4 text-center bg-transparent"
                onChange={handleChangeEvent}
                autoFocus
              />
            </span>
          </div>
        </div>
      </div>
    </LearningScreenActivityLayout>
  );
} 