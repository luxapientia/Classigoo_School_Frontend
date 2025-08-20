 "use client";

export default function ReviewStats({ stats, currentIndex }) {
  const { total, approved, unapproved } = stats;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <div className="bg-white bg-opacity-50 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Review Statistics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Questions */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{total}</div>
          <div className="text-sm text-blue-600">Total Questions</div>
        </div>

        {/* Current Position */}
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{currentIndex + 1}</div>
          <div className="text-sm text-purple-600">Current Position</div>
        </div>

        {/* Approved */}
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{approved}</div>
          <div className="text-sm text-green-600">Approved</div>
        </div>

        {/* Pending Review */}
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{unapproved}</div>
          <div className="text-sm text-yellow-600">Pending Review</div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Approval Progress</span>
          <span className="text-sm font-bold text-gray-800">{approvalRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${approvalRate}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{approved} approved</span>
          <span>{unapproved} remaining</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Completion:</span>
          <span className="font-medium">{Math.round(((currentIndex + 1) / total) * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Remaining:</span>
          <span className="font-medium">{total - (currentIndex + 1)} questions</span>
        </div>
      </div>
    </div>
  );
} 