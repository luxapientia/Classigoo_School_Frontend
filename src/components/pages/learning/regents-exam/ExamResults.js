"use client";
import { useState } from "react";

export default function ExamResults({ results, onBackToDashboard, onRetakeExam }) {
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    skippedAnswers,
    marksObtained,
    questions,
    userAnswers
  } = results;

  const getQuestionStatus = (index) => {
    if (userAnswers[index] === questions[index].correctAnswer) return "correct";
    if (userAnswers[index] === null) return "skipped";
    return "incorrect";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "correct": return "bg-green-500";
      case "incorrect": return "bg-red-500";
      case "skipped": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "correct": return "text-green-600";
      case "incorrect": return "text-red-600";
      case "skipped": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Exam Results</h1>
          <p className="text-lg text-gray-600">Here are your results for the exam.</p>
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Questions</h3>
            <p className="text-3xl font-bold text-gray-800">{totalQuestions}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-green-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Correct Answers</h3>
            <p className="text-3xl font-bold text-green-600">{correctAnswers}</p>
            <p className="text-sm text-green-600">{((correctAnswers / totalQuestions) * 100).toFixed(2)}%</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-red-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Incorrect Answers</h3>
            <p className="text-3xl font-bold text-red-600">{incorrectAnswers}</p>
            <p className="text-sm text-red-600">{((incorrectAnswers / totalQuestions) * 100).toFixed(2)}%</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Skipped Answers</h3>
            <p className="text-3xl font-bold text-yellow-600">{skippedAnswers}</p>
            <p className="text-sm text-yellow-600">{((skippedAnswers / totalQuestions) * 100).toFixed(2)}%</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Marks Obtained</h3>
            <p className="text-3xl font-bold text-blue-600">{marksObtained}/{totalQuestions}</p>
            <p className="text-sm text-blue-600">{((marksObtained / totalQuestions) * 100).toFixed(2)}%</p>
          </div>
        </div>

        {/* Result Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Result Preview</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: totalQuestions }, (_, index) => (
              <button
                key={index}
                onClick={() => setSelectedQuestion(index)}
                className={`w-12 h-12 rounded-lg font-bold text-white transition-all hover:scale-110 ${
                  getStatusColor(getQuestionStatus(index))
                } ${selectedQuestion === index ? 'ring-4 ring-blue-300' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Details */}
        {questions[selectedQuestion] && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                getStatusColor(getQuestionStatus(selectedQuestion))
              }`}>
                #{selectedQuestion + 1}
              </div>
              <span className="text-lg font-semibold text-gray-700">
                Topic: {questions[selectedQuestion].topic || "General"}
              </span>
            </div>
            
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Question:</h4>
              <p className="text-gray-700">{questions[selectedQuestion].problem}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Options:</h4>
              <div className="space-y-2">
                {Object.entries(questions[selectedQuestion].options).map(([key, value]) => {
                  const isUserAnswer = userAnswers[selectedQuestion] === key;
                  const isCorrectAnswer = key === questions[selectedQuestion].correctAnswer;
                  let optionStyle = "text-gray-700";
                  
                  if (isUserAnswer && isCorrectAnswer) {
                    optionStyle = "text-green-700 font-semibold";
                  } else if (isUserAnswer && !isCorrectAnswer) {
                    optionStyle = "text-red-700 font-semibold";
                  } else if (isCorrectAnswer) {
                    optionStyle = "text-green-700 font-semibold";
                  }
                  
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={userAnswers[selectedQuestion] === key}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span className={optionStyle}>
                        {key}. {value}
                      </span>
                      {isUserAnswer && isCorrectAnswer && (
                        <span className="text-green-600 text-xl">✔</span>
                      )}
                      {isUserAnswer && !isCorrectAnswer && (
                        <span className="text-red-600 text-xl">✗</span>
                      )}
                      {!isUserAnswer && isCorrectAnswer && (
                        <span className="text-green-600 text-xl">✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                <h4 className="text-lg font-semibold text-green-800 mb-1">Correct Answer:</h4>
                <p className="text-green-700">{questions[selectedQuestion].correctAnswer}. {questions[selectedQuestion].options[questions[selectedQuestion].correctAnswer]}</p>
              </div>
            </div>
            
            <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
              <h4 className="text-lg font-semibold text-yellow-800 mb-1">Explanation:</h4>
              <p className="text-yellow-700">{questions[selectedQuestion].explanation}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pb-8">
          <button
            onClick={onBackToDashboard}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={onRetakeExam}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Retake Exam
          </button>
        </div>
      </div>
    </div>
  );
} 