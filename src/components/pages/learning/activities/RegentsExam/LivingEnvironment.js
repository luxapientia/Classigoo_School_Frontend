"use client";
import CommonScreen from "./CommonScreen";

export default function LivingEnvironment({ user, grade }) {
  return (
    <CommonScreen
      user={user}
      grade={grade}
      subjectName="Living Environment"
      subjectTitle="Living Environment"
      subjectDescription="Living Environment studies and concepts"
      apiEndpoint="environment"
      currentIndex={2}
      backgroundIndex={2}
    />
  );
}
