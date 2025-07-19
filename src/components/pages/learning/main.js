'use client';

import Card from "@components/pages/learning/common/DashboardCard";

const cards = [
  {
    name: "Numbers (0-9)",
    link: "/learning/numbers",
  },
  {
    name: "Alphabet (A-Z)",
    link: "/learning/alphabet",
  },
  {
    name: "Creating Letters Word and Numbers",
    link: "/learning/creating-letters-numbers",
  },
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
];

export default function MainLearningComponent({ user }) {
  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-3">
          {cards.map((card, i) => (
            <Card {...card} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
