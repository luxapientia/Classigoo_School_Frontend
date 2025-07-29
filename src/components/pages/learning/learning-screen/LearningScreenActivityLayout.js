"use client";
import { useRouter } from "next/navigation";

// Pass backgroundIndex to select the background image (e.g., back0.jpg, back1.jpg, ...)
export default function LearningScreenActivityLayout({ children, title, currentIndex, backgroundIndex = 0 }) {
  const router = useRouter();

  const subactivityRoutes = [
    "/learning/learning-screen/matching-words",
    "/learning/learning-screen/complete-word",
    "/learning/learning-screen/mathematics",
    "/learning/learning-screen/matching-shape",
    "/learning/learning-screen/new-word",
  ];

  const goPrev = () => {
    if (currentIndex > 0) {
      router.push(subactivityRoutes[currentIndex - 1]);
    }
  };

  const goNext = () => {
    if (currentIndex < subactivityRoutes.length - 1) {
      router.push(subactivityRoutes[currentIndex + 1]);
    }
  };

  const goBack = () => {
    router.push("/learning/learning-screen");
  };

  // Compose the background image path
  const backgroundUrl = `/assets/img/screen/back${backgroundIndex}.jpg`;

  const isFirstScreen = currentIndex === 0;
  const isLastScreen = currentIndex === subactivityRoutes.length - 1;

  return (
    <div
      className="min-h-screen w-full overflow-y-auto"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        maxHeight: "100vh"
      }}
    >
      <div className="bg-white bg-opacity-90 shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Back Button - Different style */}
            <button
              onClick={() => router.push("/learning/learning-screen")}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-gray-300 rounded-lg hover:bg-orange-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>

            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={goPrev}
                disabled={isFirstScreen}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm ${
                  isFirstScreen
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <button
                onClick={goNext}
                disabled={isLastScreen}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm ${
                  isLastScreen
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                }`}
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
