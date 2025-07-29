"use client";

import { useSearchParams, useRouter } from "next/navigation";
import DashboardCard from "@components/pages/learning/common/DashboardCard";
import GradeCard from "@components/pages/learning/common/GradeCard";
import SubjectCard from "@components/pages/learning/common/SubjectCard";
import ActivityLayout from "@components/pages/learning/common/ActivityLayout";

const grades = [
  { name: "Grade 1", value: "1" },
  { name: "Grade 2", value: "2" },
  { name: "Grade 3", value: "3" },
  { name: "Grade 4", value: "4" },
  { name: "Grade 5", value: "5" },
  { name: "Grade 6", value: "6" },
  { name: "Grade 7", value: "7" },
  { name: "Grade 8", value: "8" },
];

const subjects = [
  {
    name: "Matching Words",
    link: "/learning/learning-screen/matching-words",
    description: "Practice word matching skills",
  },
  {
    name: "Maths",
    link: "/learning/learning-screen/maths",
    description: "Solve mathematics problems",
  },
  {
    name: "Physics",
    link: "/learning/learning-screen/physics",
    description: "Learn physics concepts",
  },
  {
    name: "Biology",
    link: "/learning/learning-screen/biology",
    description: "Explore biology topics",
  },
  {
    name: "Chemistry",
    link: "/learning/learning-screen/chemistry",
    description: "Study chemistry principles",
  },
  {
    name: "Complete Word",
    link: "/learning/learning-screen/complete-word",
    description: "Complete word exercises",
  },
  {
    name: "Matching Shape",
    link: "/learning/learning-screen/matching-shape",
    description: "Match shapes and patterns",
  },
  {
    name: "New Word",
    link: "/learning/learning-screen/new-word",
    description: "Learn new vocabulary",
  },
];

export default function LearningScreenDashboard({ user }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedGrade = searchParams.get('grade');
  const selectedSubject = searchParams.get('subject');

  const handleGradeSelect = (grade) => {
    router.push(`/learning/learning-screen?grade=${grade}`);
  };

  const handleSubjectSelect = (subject) => {
    const subjectPath = subject.link.split('/').pop(); // Extract subject name from link
    router.push(`/learning/learning-screen/${subjectPath}?grade=${selectedGrade}`);
  };

  // Show grade selection if no grade is selected
  if (!selectedGrade) {
    return (
      <ActivityLayout title="Select Grade" user={user}>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-center mb-6">
              <div className="bg-purple-500 text-white px-6 py-4 rounded-2xl shadow-lg">
                <h1 className="text-4xl font-bold text-center">Select Your Grade</h1>
              </div>
            </div>
            
            <div className="flex flex-wrap -mx-3 justify-center">
              {grades.map((grade, i) => (
                <GradeCard 
                  key={i}
                  name={grade.name}
                  value={grade.value}
                  onClick={handleGradeSelect}
                />
              ))}
            </div>
          </div>
        </div>
      </ActivityLayout>
    );
  }

  // Show subject selection if grade is selected but no subject
  if (selectedGrade && !selectedSubject) {
    return (
      <ActivityLayout title={`Grade ${selectedGrade} - Select Subject`} user={user}>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-center mb-6">
              <div className="bg-purple-500 text-white px-6 py-4 rounded-2xl shadow-lg">
                <h1 className="text-4xl font-bold text-center">Grade {selectedGrade} - Select Subject</h1>
              </div>
            </div>
            
            <div className="flex flex-wrap -mx-3">
              {subjects.map((subject, i) => (
                <SubjectCard 
                  key={i}
                  {...subject}
                  onClick={handleSubjectSelect}
                />
              ))}
            </div>
          </div>
        </div>
      </ActivityLayout>
    );
  }

  // This should not be reached in normal flow, but fallback
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
            {subjects.map((subject, i) => (
              <DashboardCard {...subject} key={i} />
            ))}
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
} 