"use client";
import CommonScreen from "./CommonScreen";

export default function Algebra2({ user, grade }) {
  return (
    <CommonScreen
      user={user}
      grade={grade}
      subjectName="Algebra II"
      subjectTitle="Algebra II"
      subjectDescription="Algebra II concepts and principles"
      apiEndpoint="algebra2"
      currentIndex={7}
      backgroundIndex={7}
    />
  );
}
