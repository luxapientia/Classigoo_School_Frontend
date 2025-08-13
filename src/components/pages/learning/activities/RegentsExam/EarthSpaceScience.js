"use client";
import CommonScreen from "./CommonScreen";

export default function EarthSpaceScience({ user, grade }) {
  return (
    <CommonScreen
      user={user}
      grade={grade}
      subjectName="Earth and Space Sciences"
      subjectTitle="Earth and Space Sciences"
      subjectDescription="Earth and Space Sciences topics and concepts"
      apiEndpoint="space"
      currentIndex={1}
      backgroundIndex={1}
    />
  );
}
