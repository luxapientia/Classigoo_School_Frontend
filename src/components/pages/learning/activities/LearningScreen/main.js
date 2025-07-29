"use client";

import DashboardCard from "@components/pages/learning/common/DashboardCard";
import ActivityLayout from "@components/pages/learning/common/ActivityLayout";

const screens = [
  {
    name: "Matching Words",
    link: "/learning/learning-screen/matching-words",
  },
  {
    name: "Complete Word",
    link: "/learning/learning-screen/complete-word",
  },
  {
    name: "Mathematics",
    link: "/learning/learning-screen/mathematics",
  },
  {
    name: "Matching Shape",
    link: "/learning/learning-screen/matching-shape",
  },
  {
    name: "New Word",
    link: "/learning/learning-screen/new-word",
  },
  // {
  //   name: "Sight Words",
  //   link: "/learning/learning-screen/sight-words",
  // },
  // {
  //   name: "Word Search",
  //   link: "/learning/learning-screen/word-search",
  // },
];

export default function LearningScreenDashboard({user}) {
  return (
    <ActivityLayout title="Learning Screen Activities" user={user}>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-center">Learning Screen Activities</h1>
            </div>
          </div>
          
        <div className="flex flex-wrap -mx-3">
          {screens.map((card, i) => (
            <DashboardCard {...card} key={i} />
          ))}
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 