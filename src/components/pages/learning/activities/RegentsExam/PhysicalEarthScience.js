"use client";
import CommonScreen from "./CommonScreen";

export default function PhysicalEarthScience({ user, grade }) {
  return (
    <CommonScreen
      user={user}
      grade={grade}
      subjectName="Physical Setting Earth Science"
      subjectTitle="Physical Setting Earth Science"
      subjectDescription="Physical Setting Earth Science concepts and principles"
      apiEndpoint="earth"
      currentIndex={3}
      backgroundIndex={3}
    />
  );
}
