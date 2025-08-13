"use client";
import CommonScreen from "./CommonScreen";

export default function LifeScienceBiology({ user, grade }) {
  return (
    <CommonScreen
      user={user}
      grade={grade}
      subjectName="Life Science Biology"
      subjectTitle="Life Science Biology"
      subjectDescription="Life Science Biology concepts and principles"
      apiEndpoint="biology"
      currentIndex={0}
      backgroundIndex={0}
    />
  );
}
