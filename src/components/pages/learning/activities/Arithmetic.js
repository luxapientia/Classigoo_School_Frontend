'use client';

import ActivityLayout from '../common/ActivityLayout';
import Card from '../common/DashboardCard';

const cards = [
  {
    name: "Addition",
    link: "/learning/arithmetic/addition",
  },
  {
    name: "Subtraction",
    link: "/learning/arithmetic/subtraction",
  },
  {
    name: "Multiplication",
    link: "/learning/arithmetic/multiplication",
  },
  {
    name: "Division",
    link: "/learning/arithmetic/division",
  },
  // {
  //   name: "Two-digit Addition",
  //   link: "/learning/arithmetic/addition2",
  // },
  // {
  //   name: "Two-digit Subtraction",
  //   link: "/learning/arithmetic/subtraction2",
  // },
  // {
  //   name: "Two-digit Multiplication",
  //   link: "/learning/arithmetic/multiplication2",
  // },
  // {
  //   name: "Two-digit Division",
  //   link: "/learning/arithmetic/division2",
  // },
  // {
  //   name: "Long Division",
  //   link: "/learning/arithmetic/long-division",
  // },
];

export default function MainArithmeticComponent({ user }) {
  return (
    <ActivityLayout title="Arithmetic">
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 sticky top-0 bg-gray-50 py-2">
            Arithmetic
          </h1>
          
          <div className="flex flex-wrap -mx-3">
            {cards.map((card, i) => (
              <Card {...card} key={i} />
            ))}
          </div>

          <div className="mt-8 text-center pb-6">
            <p className="text-gray-600">
              Choose an arithmetic operation to practice your math skills
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 