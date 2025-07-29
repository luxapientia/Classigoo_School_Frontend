"use client";
import { useState, useEffect } from "react";
import LearningScreenActivityLayout from "@components/pages/learning/learning-screen/LearningScreenActivityLayout";
import axios from "@lib/axios";
import Image from "next/image";

export default function CompleteWord({ user, grade }) {
  const [question, setQuestion] = useState(null);
  const [imageVisible, setImageVisible] = useState(false);
  const [imageName, setImageName] = useState("yes");
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const fetchRandomQuestion = async () => {
    setLoading(true);
    try {
      const { data: res } = await axios.get("/v1/learning/complete-word/random");
      if (res.status === "success") {
        setQuestion(res.data);
      } else {
        setQuestion(null);
      }
    } catch (err) {
      console.error("Error fetching complete word question:", err);
      setQuestion(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomQuestion();
  }, []);

  const checkAnswer = (answer) => {
    if (!question) return;
    
    setSelectedAnswer(answer);
    
    if (answer === question.correctAnswer) {
      setImageName("yes");
    } else {
      setImageName("no");
    }
    
    setImageVisible(true);
    setTimeout(() => {
      setImageVisible(false);
      setSelectedAnswer(null);
      fetchRandomQuestion();
    }, 1000);
  };

  // Helper to render the sentence with the missing part styled
  const renderSentence = () => {
    if (!question) return null;
    
    const { sentence, correctAnswer } = question;
    // Find the word containing the correctAnswer
    return (
      <span className="text-lg md:text-xl text-gray-900">
        {sentence.split(" ").map((word, index) => {
          if (word.includes(correctAnswer)) {
            const parts = word.split(correctAnswer);
            return (
              <span key={index}>
                {parts[0]}
                <span className="underline decoration-dashed text-red-600 font-bold text-2xl md:text-3xl mx-1">
                  {"_".repeat(correctAnswer.length)}
                </span>
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
    <LearningScreenActivityLayout title="Complete Word" currentIndex={5} backgroundIndex={5} grade={grade}>
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
          {loading || !question ? (
            <div className="text-lg text-gray-500">Loading...</div>
          ) : (
            <>
              <div className="mb-6 text-center">
                {renderSentence()}
              </div>
              <div className="flex flex-wrap justify-center items-center gap-4 mt-2">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => checkAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`font-bold py-2 px-8 rounded-lg shadow transition-colors text-lg min-w-[100px] ${
                      selectedAnswer === option
                        ? option === question.correctAnswer
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                    }`}
                    style={{ height: 48 }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </LearningScreenActivityLayout>
  );
} 