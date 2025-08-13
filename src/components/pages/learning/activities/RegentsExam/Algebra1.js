"use client";
import CommonScreen from "./CommonScreen";

export default function Algebra1({ user, grade }) {
  return (
    <CommonScreen
      user={user}
      grade={grade}
      subjectName="Algebra I"
      subjectTitle="Algebra I"
      subjectDescription="Algebra I concepts and principles"
      apiEndpoint="algebra1"
      currentIndex={6}
      backgroundIndex={6}
    />
  );
}
