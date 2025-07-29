"use client";
import { useState } from "react";
import LearningScreenActivityLayout from "@components/pages/learning/learning-screen/LearningScreenActivityLayout";
import matchingShapeData from "@components/pages/learning/common/matchingShapeData";
import Image from "next/image";

export default function MatchingShape({ user, grade }) {
  const shapes = matchingShapeData;
  const [imageVisible, setImageVisible] = useState(false);
  const [imageName, setImageName] = useState("yes");
  const [randFlag, setRandFlag] = useState(false);
  const [currentindex, setcurrentindex] = useState(0);

  const checkshape = (isFirst) => {
    setImageVisible(true);
    setTimeout(() => {
      setImageVisible(false);
      let randomIndex = -1;
      do {
        randomIndex = Math.floor(Math.random() * shapes.length);
      } while (randomIndex === currentindex);
      setcurrentindex(randomIndex);
      setRandFlag(Math.random() < 0.5);
    }, 1000);
    setImageName(isFirst === randFlag ? "yes" : "no");
  };

  return (
    <LearningScreenActivityLayout title="Matching Shape" currentIndex={6} backgroundIndex={6} grade={grade}>
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
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-8 mt-4 drop-shadow bg-white bg-opacity-90 rounded-xl px-6 py-2 text-green-600">
          Click the shape that have equal parts.
        </h1>
        <div className="bg-white rounded-xl shadow-lg px-6 py-8 max-w-2xl w-full flex flex-col items-center">
          <div className="flex justify-center items-center gap-12 mt-2">
            <Image
              src={`/assets/img/screen/${shapes[currentindex]}${randFlag ? ".png" : "_dis.png"}`}
              alt="shape1"
              width={200}
              height={200}
              className="cursor-pointer rounded-lg border-2 border-gray-300 hover:border-blue-500"
              onClick={() => checkshape(true)}
            />
            <Image
              src={`/assets/img/screen/${shapes[currentindex]}${randFlag ? "_dis.png" : ".png"}`}
              alt="shape2"
              width={200}
              height={200}
              className="cursor-pointer rounded-lg border-2 border-gray-300 hover:border-blue-500"
              onClick={() => checkshape(false)}
            />
          </div>
        </div>
      </div>
    </LearningScreenActivityLayout>
  );
} 