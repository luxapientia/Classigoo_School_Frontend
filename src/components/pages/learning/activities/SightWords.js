"use client";
import { useState } from "react";
import LearningScreenActivityLayout from "@components/pages/learning/learning-screen/LearningScreenActivityLayout";
import newWordData from "@components/pages/learning/common/newWordData";
import WritingCanvas from "@components/pages/learning/common/WritingCanvas";

const crayonImages = {
  red: "/assets/img/screen/redcrayon.png",
  blue: "/assets/img/screen/bluecrayon.png",
  yellow: "/assets/img/screen/yellowcrayon.png",
};
const crayonColors = ["red", "blue", "yellow"];

export default function SightWords() {
  const wordsdata = newWordData;
  const [color, setColor] = useState("red");
  const [canvasKey, setCanvasKey] = useState(0);
  const [shuffleData, setShuffledData] = useState(wordsdata.slice(0, 3).map((item) => item.word));

  const handleShuffle = () => {
    const shuffledData = [...wordsdata];
    for (let i = shuffledData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
    }
    setShuffledData(shuffledData.slice(0, 3).map((item) => item.word));
    setCanvasKey((k) => k + 1);
  };

  // 3x3 flex rows
  const gridWords = [
    [shuffleData[0], shuffleData[1], shuffleData[2]],
    [shuffleData[2], shuffleData[2], shuffleData[0]],
    [shuffleData[1], shuffleData[0], shuffleData[1]],
  ];

  return (
    <LearningScreenActivityLayout title="Sight Words" currentIndex={5} backgroundIndex={5}>
      <div className="flex flex-col items-center min-h-screen w-full overflow-y-auto py-8">
        <button className="mb-4 px-4 py-2 bg-white border border-gray-400 text-gray-800 rounded shadow text-sm" onClick={handleShuffle}>
          New Word
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 text-center mb-4">Read and color the sight words:</h1>
        <div className="flex flex-row items-center justify-center gap-8 mb-6">
          {crayonColors.map((crayon, idx) => (
            <div
              key={crayon}
              className={`flex items-center cursor-pointer border-2 rounded-lg px-4 py-1 ${color === crayon ? `border-${crayon}-500` : 'border-transparent'}`}
              onClick={() => setColor(crayon)}
            >
              <span className={`font-bold text-3xl mr-2 ${crayon === 'red' ? 'text-red-600' : crayon === 'blue' ? 'text-blue-600' : 'text-yellow-400'}`}>{shuffleData[idx]}</span>
              <img src={crayonImages[crayon]} alt={`${crayon} crayon`} width={40} height={20} />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-6 w-full items-center">
          {gridWords.map((row, rowIdx) => (
            <div key={rowIdx} className="flex flex-row gap-6 justify-center">
              {row.map((word, colIdx) => (
                <WritingCanvas
                  color={color}
                  text={word}
                  width={200}
                  height={80}
                  key={`${canvasKey}-${rowIdx}-${colIdx}`}
                  style={{ backgroundColor: 'white', borderRadius: 8 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </LearningScreenActivityLayout>
  );
} 