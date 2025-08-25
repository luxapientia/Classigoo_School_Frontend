"use client";
import { useRouter } from "next/navigation";

// Pass backgroundIndex to select the background image (e.g., back0.jpg, back1.jpg, ...)
export default function RegentsExamActivityLayout({ children, title, currentIndex, backgroundIndex = 0, grade }) {
  const router = useRouter();

  const subactivityRoutes = [
    "/learning/regents-exam/life-science-biology",
    "/learning/regents-exam/earth-space-science",
    "/learning/regents-exam/living-environment",
    "/learning/regents-exam/physical-earth-science",
    "/learning/regents-exam/physical-setting-chemistry",
    "/learning/regents-exam/physical-setting-physics",
    "/learning/regents-exam/algebra-I",
    "/learning/regents-exam/algebra-II",
  ];

  const goPrev = () => {
    if (currentIndex > 0) {
      router.push(`${subactivityRoutes[currentIndex - 1]}?grade=${grade}`);
    }
  };

  const goNext = () => {
    if (currentIndex < subactivityRoutes.length - 1) {
      router.push(`${subactivityRoutes[currentIndex + 1]}?grade=${grade}`);
    }
  };

  const goBack = () => {
    router.push("/learning/regents-exam");
  };

  // Compose the background image path
  const backgroundUrl = `/assets/img/screen/nys_regents_background_${backgroundIndex}.jpg`;

  const isFirstScreen = currentIndex === 0;
  const isLastScreen = currentIndex === subactivityRoutes.length - 1;

  return (
    <div
      className="min-h-screen w-full overflow-y-auto"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        maxHeight: "100vh"
      }}
    >
      {/* Header - Improved responsive design */}
      <div className="bg-white bg-opacity-95 shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:py-3 h-auto sm:h-16 gap-3 sm:gap-0">
            {/* Back Button - More touch-friendly */}
            <button
              onClick={goBack}
              className="inline-flex items-center px-4 py-3 sm:py-2 text-sm font-medium text-white bg-orange-500 border border-orange-400 rounded-lg hover:bg-orange-600 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto justify-center sm:justify-start order-1 sm:order-none"
            >
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </button>

            {/* Title - Responsive text sizing */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 text-center sm:text-left order-2 sm:order-none flex-1 sm:flex-none">
              {title}
            </h1>

            {/* Navigation Buttons - Better mobile layout */}
            <div className="flex items-center space-x-2 sm:space-x-3 order-3 sm:order-none w-full sm:w-auto justify-center sm:justify-end">
              <button
                onClick={goPrev}
                disabled={isFirstScreen}
                className={`inline-flex items-center px-3 sm:px-4 py-3 sm:py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md min-w-[80px] sm:min-w-[100px] justify-center ${
                  isFirstScreen
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                <svg className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>

              <button
                onClick={goNext}
                disabled={isLastScreen}
                className={`inline-flex items-center px-3 sm:px-4 py-3 sm:py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md min-w-[80px] sm:min-w-[100px] justify-center ${
                  isLastScreen
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <svg className="w-4 h-4 ml-1 sm:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Better responsive container */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
