"use client";

export default function ModeSelectionModal({ user, isOpen, onClose, onModeSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
          Select Mode
        </h2>
        
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => onModeSelect('practice')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Practice Mode</h3>
              <p className="text-blue-100 text-xs sm:text-sm">Practice with random questions endlessly</p>
            </div>
          </button>
          
          <button
            onClick={() => onModeSelect('exam')}
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Exam Mode</h3>
              <p className="text-green-100 text-xs sm:text-sm">Take a timed exam with specific questions</p>
            </div>
          </button>
          
          {
            user.role !== "parent" && (
            <button
              onClick={() => onModeSelect('edit')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Edit Questions</h3>
                <p className="text-orange-100 text-xs sm:text-sm">Review and approve questions in the database</p>
              </div>
            </button>
            )
          }
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-4 sm:mt-6 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 