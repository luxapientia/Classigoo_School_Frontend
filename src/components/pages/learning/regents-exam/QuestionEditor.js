"use client";

export default function QuestionEditor({ question, onChange, onOptionChange, isApproved }) {
  if (!question) return null;

  const handleCorrectAnswerChange = (selectedAnswer) => {
    onChange('correctAnswer', selectedAnswer);
  };

  return (
    <div className="bg-white bg-opacity-50 rounded-xl shadow-lg p-6 space-y-6">
      {/* Header with approval status */}
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-xl font-bold text-gray-800">Question Editor</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isApproved 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {isApproved ? '✓ Approved' : '⏳ Pending Review'}
        </div>
      </div>

      {/* Problem */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Problem Statement *
        </label>
        <textarea
          value={question.problem || ''}
          onChange={(e) => onChange('problem', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-vertical"
          placeholder="Enter the question problem..."
        />
      </div>

      {/* Options */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Answer Options *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['A', 'B', 'C', 'D'].map((option) => (
            <div key={option} className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">
                Option {option}
              </label>
              <textarea
                value={question.options?.[option] || ''}
                onChange={(e) => onOptionChange(option, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-vertical"
                placeholder={`Enter option ${option}...`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Correct Answer */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Correct Answer *
        </label>
        <div className="flex flex-wrap gap-4">
          {['A', 'B', 'C', 'D'].map((option) => (
            <label
              key={option}
              className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                question.correctAnswer === option
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-600'
              }`}
            >
              <input
                type="radio"
                name="correctAnswer"
                value={option}
                checked={question.correctAnswer === option}
                onChange={() => handleCorrectAnswerChange(option)}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <span className="font-medium">Option {option}</span>
              {question.correctAnswer === option && (
                <span className="text-green-600">✓</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Explanation *
        </label>
        <textarea
          value={question.explanation || ''}
          onChange={(e) => onChange('explanation', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-vertical"
          placeholder="Enter explanation for the correct answer..."
        />
      </div>

      {/* Topic */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Topic *
        </label>
        <input
          type="text"
          value={question.topic || ''}
          onChange={(e) => onChange('topic', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter the topic/subject area..."
        />
      </div>

      {/* Grade (read-only) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Grade Level
        </label>
        <input
          type="text"
          value={question.grade || ''}
          disabled
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
        />
      </div>

      {/* Validation Messages */}
      <div className="text-sm text-gray-900">
        <p>* Required fields</p>
        {(!question.problem || !question.explanation || !question.topic || !question.correctAnswer) && (
          <p className="text-orange-600 mt-1">⚠️ Some required fields are missing</p>
        )}
        {(!question.options?.A || !question.options?.B || !question.options?.C || !question.options?.D) && (
          <p className="text-orange-600 mt-1">⚠️ All answer options must be filled</p>
        )}
      </div>
    </div>
  );
} 