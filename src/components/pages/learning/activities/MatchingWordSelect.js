"use client";
import { useState, useEffect } from "react";
import LearningScreenActivityLayout from "@components/pages/learning/learning-screen/LearningScreenActivityLayout";
import axios from "@lib/axios";
import Image from "next/image";

export default function MatchingWordSelect() {
  const [question, setQuestion] = useState(null);
  const [imageVisible, setImageVisible] = useState(false);
  const [imageName, setImageName] = useState("yes");
  const [loading, setLoading] = useState(true);

  const fetchRandomQuestion = async () => {
    setLoading(true);
    try {
      const { data: res } = await axios.get("/v1/learning/matching-word/random");
      if (res.status === "success") {
        setQuestion(res.data);
      } else {
        setQuestion(null);
      }
    } catch (err) {
      setQuestion(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomQuestion();
  }, []);

  const checkWord = (word) => {
    if (!question) return;
    if (word === question.correctAnswer) {
      setImageName("yes");
    } else setImageName("no");
    setImageVisible(true);
    setTimeout(() => {
      setImageVisible(false);
      fetchRandomQuestion();
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
          {loading || !question ? (
            <div className="text-lg text-gray-500">Loading...</div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <span className="text-lg md:text-xl text-gray-900">
                  {question.sentence.split(" ").map((word, index) => (
                    <span key={index}>
                      {word.replace(/[^a-zA-Z']/g, "") === question.target ? (
                        <span className="underline decoration-dashed text-red-600 font-bold text-2xl md:text-3xl mx-1">
                          {word}
                        </span>
                      ) : (
                        word
                      )}
                      {index !== question.sentence.split(" ").length - 1 && " "}
                    </span>
                  ))}
                </span>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-4 mt-2">
                {question.options.map((item, index) => (
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
            </>
          )}
        </div>
      </div>
    </LearningScreenActivityLayout>
  );
} 