"use client";
import { useState, useEffect } from "react";
import RegentsExamActivityLayout from "@components/pages/learning/regents-exam/RegentsExamActivityLayout";
import ModeSelectionModal from "@components/pages/learning/regents-exam/ModeSelectionModal";
import ExamConfigModal from "@components/pages/learning/regents-exam/ExamConfigModal";
import CountdownTimer from "@components/pages/learning/regents-exam/CountdownTimer";
import ExamResults from "@components/pages/learning/regents-exam/ExamResults";
import Image from "next/image";
import axios from "@lib/axios";

export default function CommonScreen({ 
  user, 
  grade, 
  subjectName, 
  subjectTitle, 
  subjectDescription,
  apiEndpoint,
  currentIndex,
  backgroundIndex = 0 
}) {
  // Mode and exam state
  const [mode, setMode] = useState(null); // "practice" or "exam"
  const [showModeModal, setShowModeModal] = useState(true);
  const [showExamConfig, setShowExamConfig] = useState(false);
  const [examConfig, setExamConfig] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentExamQuestion, setCurrentExamQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [examCompleted, setExamCompleted] = useState(false);
  const [examResults, setExamResults] = useState(null);

  // Practice mode state
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [imageVisible, setImageVisible] = useState(false);
  const [imageName, setImageName] = useState("yes");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch random question for practice mode
  const fetchRandomQuestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const gradeNumber = Math.max(Number(grade), 3);
      const { data: res } = await axios.get(`/v1/learning/nys/${apiEndpoint}/random?grade=${gradeNumber}`);
      if (res.status === "success" && res.data) {
        setCurrentQuestion(res.data);
      } else {
        setError(res.message || "Failed to fetch question");
        setCurrentQuestion(null);
      }
    } catch (err) {
      console.error("Error fetching random question:", err);
      setError("Network error occurred");
      setCurrentQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch exam questions
  const fetchExamQuestions = async (questionCount) => {
    setLoading(true);
    setError(null);
    try {
      const gradeNumber = Math.max(Number(grade), 3);
      const { data: res } = await axios.get(`/v1/learning/nys/${apiEndpoint}/exam?grade=${gradeNumber}&count=${questionCount}`);
      if (res.status === "success" && res.data) {
        setExamQuestions(res.data);
        setUserAnswers(new Array(res.data.length).fill(null));
        setCurrentExamQuestion(0);
      } else {
        setError(res.message || "Failed to fetch exam questions");
        setExamQuestions([]);
      }
    } catch (err) {
      console.error("Error fetching exam questions:", err);
      setError("Network error occurred");
      setExamQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "practice") {
      fetchRandomQuestion();
    }
  }, [mode, grade]);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setShowModeModal(false);
    
    if (selectedMode === "exam") {
      setShowExamConfig(true);
    }
  };

  const handleExamConfig = (config) => {
    setExamConfig(config);
    setShowExamConfig(false);
    
    // Fetch exam questions from backend
    fetchExamQuestions(config.questionCount);
  };

  const handleExamAnswer = (answer) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentExamQuestion] = answer;
    setUserAnswers(newUserAnswers);
  };

  const goToQuestion = (questionIndex) => {
    setCurrentExamQuestion(questionIndex);
  };

  const goToNextQuestion = () => {
    if (currentExamQuestion < examQuestions.length - 1) {
      setCurrentExamQuestion(prev => prev + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentExamQuestion > 0) {
      setCurrentExamQuestion(prev => prev - 1);
    }
  };

  const finishExam = () => {
    const correct = userAnswers.filter((answer, index) => 
      answer === examQuestions[index].correctAnswer
    ).length;
    
    const answered = userAnswers.filter(answer => answer !== null).length;
    const incorrect = answered - correct;
    const skipped = userAnswers.filter(answer => answer === null).length;
    
    setExamResults({
      totalQuestions: examQuestions.length,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      skippedAnswers: skipped,
      marksObtained: correct,
      questions: examQuestions,
      userAnswers: userAnswers
    });
    
    setExamCompleted(true);
  };

  const handleTimeUp = () => {
    finishExam();
  };

  const handleBackToDashboard = () => {
    setMode(null);
    setShowModeModal(true);
    setExamCompleted(false);
    setExamResults(null);
    setExamConfig(null);
    setExamQuestions([]);
    setUserAnswers([]);
    setCurrentExamQuestion(0);
    setError(null);
  };

  const handleRetakeExam = () => {
    setExamCompleted(false);
    setExamResults(null);
    setShowExamConfig(true);
  };

  // Practice mode logic
  const checkAnswer = (answer) => {
    if (!currentQuestion) return;
    
    setSelectedAnswer(answer);
    
    if (answer === currentQuestion.correctAnswer) {
      setImageName("yes");
    } else {
      setImageName("no");
    }
    
    setImageVisible(true);
    setShowExplanation(true);
    
    setTimeout(() => {
      setImageVisible(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
      // Get a new random question
      fetchRandomQuestion();
    }, 3000);
  };

  const getNextQuestion = () => {
    fetchRandomQuestion();
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  // Show exam results
  if (examCompleted && examResults) {
    return (
      <ExamResults
        results={examResults}
        onBackToDashboard={handleBackToDashboard}
        onRetakeExam={handleRetakeExam}
      />
    );
  }

  // Show exam mode
  if (mode === "exam" && examQuestions.length > 0 && !examCompleted) {
    const currentQuestion = examQuestions[currentExamQuestion];
    
    return (
      <RegentsExamActivityLayout title={`${subjectTitle} - Exam`} currentIndex={currentIndex} backgroundIndex={backgroundIndex} grade={grade}>
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
        
        {/* Question Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Question Navigation</h3>
          <div className="flex flex-wrap gap-2">
            {examQuestions.map((_, index) => {
              // During exam, only show answered vs unanswered
              const isAnswered = userAnswers[index] !== null;
              const statusColor = isAnswered ? "bg-blue-500" : "bg-gray-300";
              const isCurrent = index === currentExamQuestion;
              
              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-bold text-white transition-all hover:scale-110 ${
                    statusColor
                  } ${isCurrent ? "ring-4 ring-blue-300" : ""}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <h1 className="text-2xl md:text-3xl font-semibold text-pink-400 text-center mb-8 mt-4 drop-shadow">
                Question {currentExamQuestion + 1} of {examQuestions.length}
              </h1>
              
              <div className="bg-white rounded-xl shadow-lg px-6 py-8 max-w-2xl w-full flex flex-col items-center">
                <div className="mb-6 text-center">
                  <span className="text-lg md:text-xl text-gray-900 font-medium">
                    {currentQuestion.problem}
                  </span>
                </div>
                
                <div className="flex flex-col gap-3 w-full mb-6">
                  {Object.entries(currentQuestion.options).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleExamAnswer(key)}
                      className={`font-bold py-3 px-6 rounded-lg shadow transition-colors text-lg w-full text-left ${
                        userAnswers[currentExamQuestion] === key
                          ? "bg-blue-500 text-white"
                          : "bg-orange-500 hover:bg-orange-600 text-white"
                      }`}
                    >
                      <span className="font-bold mr-3">{key}.</span>
                      {value}
                    </button>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={goToPrevQuestion}
                    disabled={currentExamQuestion === 0}
                    className={`flex-1 py-2 px-4 rounded-lg font-bold transition-colors ${
                      currentExamQuestion === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={goToNextQuestion}
                    disabled={currentExamQuestion === examQuestions.length - 1}
                    className={`flex-1 py-2 px-4 rounded-lg font-bold transition-colors ${
                      currentExamQuestion === examQuestions.length - 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-4">
            {/* Timer */}
            {examConfig?.timerEnabled && (
              <CountdownTimer
                initialTime={examConfig.examTime}
                onTimeUp={handleTimeUp}
              />
            )}
            
            {/* Progress */}
            <div className="bg-pink-400 rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">Progress</h3>
              <div className="space-y-2 text-white">
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span className="font-bold">{userAnswers.filter(a => a !== null).length}/{examQuestions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className="font-bold">{examQuestions.length - userAnswers.filter(a => a !== null).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current:</span>
                  <span className="font-bold">{currentExamQuestion + 1}</span>
                </div>
              </div>
            </div>

            {/* End Exam Button */}
            <button
              onClick={finishExam}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg"
            >
              End Exam
            </button>
          </div>
        </div>
      </RegentsExamActivityLayout>
    );
  }

  // Show practice mode
  if (mode === "practice") {
    if (loading) {
      return (
        <RegentsExamActivityLayout title={subjectTitle} currentIndex={currentIndex} backgroundIndex={backgroundIndex} grade={grade}>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-lg text-gray-500">Loading question...</div>
          </div>
        </RegentsExamActivityLayout>
      );
    }

    if (error) {
      return (
        <RegentsExamActivityLayout title={subjectTitle} currentIndex={currentIndex} backgroundIndex={backgroundIndex} grade={grade}>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-lg text-red-500 mb-4">Error: {error}</div>
            <button
              onClick={fetchRandomQuestion}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </RegentsExamActivityLayout>
      );
    }

    if (!currentQuestion) {
      return (
        <RegentsExamActivityLayout title={subjectTitle} currentIndex={currentIndex} backgroundIndex={backgroundIndex} grade={grade}>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-lg text-gray-500">No questions available</div>
          </div>
        </RegentsExamActivityLayout>
      );
    }

    return (
      <RegentsExamActivityLayout title={`${subjectTitle} - Practice`} currentIndex={currentIndex} backgroundIndex={backgroundIndex} grade={grade}>
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
          <h1 className="text-2xl md:text-3xl font-semibold text-pink-400 text-center mb-8 mt-4 drop-shadow">
            Practice Mode - Answer the {subjectName} question below.
          </h1>
          <div className="bg-white rounded-xl shadow-lg px-6 py-8 max-w-2xl w-full flex flex-col items-center">
            <div className="mb-6 text-center">
              <span className="text-lg md:text-xl text-gray-900 font-medium">
                {currentQuestion.problem}
              </span>
            </div>
            
            <div className="flex flex-col gap-3 w-full mb-6">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => checkAnswer(key)}
                  disabled={selectedAnswer !== null}
                  className={`font-bold py-3 px-6 rounded-lg shadow transition-colors text-lg w-full text-left ${
                    selectedAnswer === key
                      ? key === currentQuestion.correctAnswer
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  <span className="font-bold mr-3">{key}.</span>
                  {value}
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-blue-800 mb-2">Explanation:</h3>
                <p className="text-blue-700">{currentQuestion.explanation}</p>
              </div>
            )}

            <button
              onClick={getNextQuestion}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Next Question
            </button>
          </div>
        </div>
      </RegentsExamActivityLayout>
    );
  }

  // Show mode selection modal
  return (
    <RegentsExamActivityLayout title={subjectTitle} currentIndex={currentIndex} backgroundIndex={backgroundIndex} grade={grade}>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl md:text-3xl font-semibold text-pink-400 text-center mb-8 mt-4 drop-shadow">
          Welcome to {subjectTitle}
        </h1>
        <div className="bg-white rounded-xl shadow-lg px-8 py-6 max-w-md w-full text-center">
          <p className="text-gray-600 mb-4">{subjectDescription}</p>
          <button
            onClick={() => setShowModeModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Select Mode
          </button>
        </div>
      </div>

      <ModeSelectionModal
        isOpen={showModeModal}
        onClose={() => setShowModeModal(false)}
        onModeSelect={handleModeSelect}
      />

      <ExamConfigModal
        isOpen={showExamConfig}
        onClose={() => setShowExamConfig(false)}
        onStartExam={handleExamConfig}
      />
    </RegentsExamActivityLayout>
  );
}
