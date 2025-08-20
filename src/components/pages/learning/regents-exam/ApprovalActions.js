"use client";

export default function ApprovalActions({ 
  onApprove, 
  onReject, 
  onBackToDashboard, 
  isLoading, 
  isApproved 
}) {
  return (
    <div className="bg-white bg-opacity-50 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Reject Button */}
        <button
          onClick={onReject}
          disabled={isLoading}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-bold transition-all ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 text-white transform hover:scale-105 shadow-lg'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Reject & Delete</span>
            </>
          )}
        </button>

        {/* Approve Button */}
        <button
          onClick={onApprove}
          disabled={isLoading}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-bold transition-all ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isApproved 
                ? 'bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105 shadow-lg'
                : 'bg-green-500 hover:bg-green-600 text-white transform hover:scale-105 shadow-lg'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{isApproved ? 'Update & Re-approve' : 'Approve Question'}</span>
            </>
          )}
        </button>
      </div>

      {/* Status Message */}
      <div className="mt-4 p-3 rounded-lg bg-gray-50">
        <div className="flex items-center space-x-2">
          {isApproved ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                This question is already approved. You can still edit and re-approve if needed.
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-700">
                This question is pending review. Make any necessary edits and approve or reject.
              </span>
            </>
          )}
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onBackToDashboard}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-xs text-black">
        <p><strong>Approve:</strong> Save changes and mark as approved for use in practice/exam modes</p>
        <p><strong>Reject:</strong> Permanently delete this question from the database</p>
      </div>
    </div>
  );
} 