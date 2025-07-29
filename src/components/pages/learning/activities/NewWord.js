"use client";
import { useState, useRef, useEffect } from "react";
import LearningScreenActivityLayout from "@components/pages/learning/learning-screen/LearningScreenActivityLayout";
import newWordData from "@components/pages/learning/common/newWordData";
import HandWritingCanvas from "@components/pages/learning/common/HandWritingCanvas";
import WritingCanvas from "@components/pages/learning/common/WritingCanvas";

export default function NewWord({ user, grade }) {
  const wordsdata = newWordData;
  const [curIndex, setIndex] = useState(0);
  const [clickedLetterIndexes, setClickedLetterIndexes] = useState([]);
  const [clickedWord, setClickedWord] = useState("");
  const [selectedWordLetters, setSelectedWordLetters] = useState([]);
  const handWritingCanvasRef = useRef();
  const [screenWidth, setScreenWidth] = useState(0);
  const [rainbowColor, setRainbowColor] = useState("#FF000011");
  const [canvasKey, setCanvasKey] = useState(0);
  const rainbowColors = [
    "#FF0000",
    "#FFA500",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#4B0082",
    "#EE82EE",
  ];

  useEffect(() => {
    setSelectedWordLetters(shuffleArray(wordsdata[curIndex].word.split("")));
    setClickedWord("");
    setClickedLetterIndexes([]);
    setScreenWidth(window.innerWidth);
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [curIndex]);

  const handleLetterClicked = (index) => {
    setClickedLetterIndexes([...clickedLetterIndexes, index]);
    const clicked = [...clickedLetterIndexes, index]
      .map((clickedIndex) => selectedWordLetters[clickedIndex])
      .join("");
    setClickedWord(clicked);
  };

  const changeWord = () => {
    let newIndex = Math.floor(Math.random() * wordsdata.length);
    setIndex(newIndex);
    setCanvasKey((k) => k + 1);
  };

  return (
    <LearningScreenActivityLayout title="New Word" currentIndex={7} backgroundIndex={7} grade={grade}>
      <div className="flex flex-col items-center justify-center min-h-screen w-full overflow-y-auto py-8">
        <button className="mb-4 px-4 py-2 bg-white border border-gray-400 text-gray-800 rounded shadow text-sm" onClick={changeWord}>
          New Word
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 text-center">Read the word:</h1>
        <span className="text-green-700 text-6xl font-extrabold text-center mb-2">{wordsdata[curIndex].word}</span>

        <h1 className="text-2xl font-bold text-orange-500 text-center mt-4">Trace the word:</h1>
        <div className="flex justify-center w-full mb-4">
          <div className="bg-white rounded-lg p-2 flex items-center justify-center h-[200px] w-[400px]">
            <HandWritingCanvas ref={handWritingCanvasRef} width={400} height={200} key={canvasKey + '-trace'} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-yellow-500 text-center mt-4">Build the word:</h1>
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedWordLetters.map((letter, index) =>
            clickedLetterIndexes.includes(index) ? null : (
              <button
                key={index}
                className="bg-blue-200 hover:bg-blue-400 text-3xl font-bold rounded p-2 shadow border border-blue-400"
                onClick={() => handleLetterClicked(index)}
              >
                {letter}
              </button>
            )
          )}
        </div>
        <span className="text-gray-800 text-5xl font-bold mb-2">{clickedWord}</span>

        <h1 className="text-2xl font-bold text-purple-600 text-center mt-4">Color the word:</h1>
        <div className="flex justify-center w-full mb-4">
          <WritingCanvas color="rgba(255,0,0,0.1)" text={wordsdata[curIndex].word} width={400} height={200} key={canvasKey + '-color'} style={{ backgroundColor: 'white', borderRadius: 12 }} />
        </div>

        <h1 className="text-2xl font-bold text-pink-400 text-center mt-4">Write the word:</h1>
        <div className="flex justify-center w-full mb-4">
          <WritingCanvas color="rgba(0,0,0,0.1)" text={""} width={400} height={200} key={canvasKey + '-write'} style={{ backgroundColor: 'white', borderRadius: 12 }} />
        </div>

        <h1 className="text-2xl font-bold text-green-700 text-center mt-4">Rainbow color the word:</h1>
        <div className="flex flex-row gap-2 mb-2">
          {rainbowColors.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: color, border: rainbowColor === color + "11" ? "2px solid black" : "none" }}
              onClick={() => setRainbowColor(color + "11")}
            />
          ))}
        </div>
        <div className="flex justify-center w-full mb-4">
          <WritingCanvas color={rainbowColor} text={wordsdata[curIndex].word} width={400} height={200} key={canvasKey + '-rainbow'} style={{ backgroundColor: 'white', borderRadius: 12 }} />
        </div>
      </div>
    </LearningScreenActivityLayout>
  );
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
