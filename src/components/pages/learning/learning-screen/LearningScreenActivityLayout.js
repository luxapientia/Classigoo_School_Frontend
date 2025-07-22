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
    "/learning/learning-screen/sight-words",
    "/learning/learning-screen/word-search",
  ];

  const goPrev = () => {
    if (currentIndex === 0) {
      router.push("/learning/learning-screen");
    } else {
      router.push(subactivityRoutes[currentIndex - 1]);
    }
  };

  const goNext = () => {
    if (currentIndex < subactivityRoutes.length - 1) {
      router.push(subactivityRoutes[currentIndex + 1]);
    }
  };

  // Compose the background image path
  const backgroundUrl = `/assets/img/screen/back${backgroundIndex}.jpg`;

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
      <div className="bg-white bg-opacity-80 shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={goPrev}
              className="text-sky-600 hover:text-sky-700 flex items-center space-x-2"
            >
              <span>⬅ Prev</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <button
              onClick={goNext}
              className={`text-sky-600 hover:text-sky-700 flex items-center space-x-2 ${currentIndex === subactivityRoutes.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={currentIndex === subactivityRoutes.length - 1}
            >
              <span>Next ➡</span>
            </button>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
