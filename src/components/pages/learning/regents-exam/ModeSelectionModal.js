"use client";

export default function ModeSelectionModal({ isOpen, onClose, onModeSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Select Mode
        </h2>
        
        <div className="space-y-4">
          <button
            onClick={() => onModeSelect('practice')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Practice Mode</h3>
              <p className="text-blue-100 text-sm">Practice with random questions endlessly</p>
            </div>
          </button>
          
          <button
            onClick={() => onModeSelect('exam')}
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Exam Mode</h3>
              <p className="text-green-100 text-sm">Take a timed exam with specific questions</p>
            </div>
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 