"use client";

import { useSearchParams, useRouter } from "next/navigation";
import DashboardCard from "@components/pages/learning/common/DashboardCard";
import GradeCard from "@components/pages/learning/common/GradeCard";
import SubjectCard from "@components/pages/learning/common/SubjectCard";
import ActivityLayout from "@components/pages/learning/common/ActivityLayout";

const grades = [
  { name: "Grade 9", value: "9" },
  { name: "Grade 10", value: "10" },
  { name: "Grade 11", value: "11" },
  { name: "Grade 12", value: "12" },
];

const subjects = [
  {
    name: "Life Science Biology",
    link: "/learning/regents-exam/life-science-biology",
    description: "Life Science Biology concepts and principles",
  },
  {
    name: "Earth and Space Sciences",
    link: "/learning/regents-exam/earth-space-sciences",
    description: "Earth and Space Sciences topics",
  },
  {
    name: "Living Environment",
    link: "/learning/regents-exam/living-environment",
    description: "Living Environment studies",
  },
  {
    name: "Physical Setting Earth Science",
    link: "/learning/regents-exam/physical-setting-earth-science",
    description: "Physical Setting Earth Science concepts",
  },
  {
    name: "Physical Setting Chemistry",
    link: "/learning/regents-exam/physical-setting-chemistry",
    description: "Physical Setting Chemistry principles",
  },
  {
    name: "Physical Setting Physics",
    link: "/learning/regents-exam/physical-setting-physics",
    description: "Physical Setting Physics fundamentals",
  },
];

export default function RegentsExamDashboard({ user }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedGrade = searchParams.get('grade');
  const selectedSubject = searchParams.get('subject');

  const handleGradeSelect = (grade) => {
    router.push(`/learning/regents-exam?grade=${grade}`);
  };

  const handleSubjectSelect = (subject) => {
    const subjectPath = subject.link.split('/').pop(); // Extract subject name from link
    router.push(`/learning/regents-exam/${subjectPath}?grade=${selectedGrade}`);
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
    <ActivityLayout title="Regents Exam Activities" user={user}>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              <h1 className="text-4xl font-bold text-center">Regents Exam Activities</h1>
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
