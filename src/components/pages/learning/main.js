'use client';

import Card from "@components/pages/learning/common/DashboardCard";
import ActivityLayout from "@components/pages/learning/common/ActivityLayout";

const cards = [
  {
    name: "Numbers (0-9)",
    link: "/learning/numbers",
  },
  {
    name: "Alphabet (A-Z)",
    link: "/learning/alphabet",
  },
  // {
  //   name: "Creating Letters Word and Numbers",
  //   link: "/learning/creating-letters-numbers",
  // },
  // {
  //   name: "Learn to Read",
  //   link: "/learning/learn-to-read",
  // },
  {
    name: "Filling Missing Letters",
    link: "/learning/filling-missing-letters",
  },
  {
    name: "Counting Numbers",
    link: "/learning/counting-numbers",
  },
  {
    name: "ABC Games",
    link: "/learning/abc-games",
  },
  {
    name: "Number Games",
    link: "/learning/number-games",
  },
  // {
  //   name: "Coloring animals and planets",
  //   link: "/learning/coloring",
  // },
  {
    name: "Arithmetic",
    link: "/learning/arithmetic",
  },
  {
    name: "Writing Letters",
    link: "/learning/writing-letters",
  },
  {
    name: "Learning Screen",
    link: "/learning/learning-screen",
  },
  {
    name: "Long Vowels",
    link: "/learning/long-vowels",
  },
  {
    name: "Regents Exam",
    link: "/learning/regents-exam",
  },
];

export default function MainLearningComponent({ user }) {
  return (
    <ActivityLayout title="Learning Activities" user={user}>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-center">Learning Activities</h1>
            </div>
          </div>


          <div className="flex flex-wrap -mx-3">
            {cards.map((card, i) => (
              <Card {...card} key={i} />
            ))}
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
}
