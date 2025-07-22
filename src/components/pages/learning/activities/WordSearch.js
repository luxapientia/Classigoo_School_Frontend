"use client";
import LearningScreenActivityLayout from "@components/pages/learning/learning-screen/LearningScreenActivityLayout";

export default function WordSearch() {
  return (
    <LearningScreenActivityLayout title="Word Search" currentIndex={6}>
      <div className="w-full flex justify-center mt-8">
        <iframe
          style={{ width: "100%", height: "900px" }}
          src="/wordsearch/wordsearch.html"
          title="Word Search Game"
        />
      </div>
    </LearningScreenActivityLayout>
  );
} 