"use client";
import CommonScreen from "./CommonScreen";

export default function PhysicalSettingPhysics({ user, grade }) {
  return (
    <CommonScreen
      user={user}
      grade={grade}
      subjectName="Physical Setting Physics"
      subjectTitle="Physical Setting Physics"
      subjectDescription="Physical Setting Physics fundamentals and concepts"
      apiEndpoint="physics"
      currentIndex={5}
      backgroundIndex={5}
    />
  );
}
