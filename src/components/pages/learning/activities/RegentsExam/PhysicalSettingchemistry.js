"use client";
import CommonScreen from "./CommonScreen";

export default function PhysicalSettingChemistry({ user, grade }) {
  return (
    <CommonScreen
      user={user}
      grade={grade}
      subjectName="Physical Setting Chemistry"
      subjectTitle="Physical Setting Chemistry"
      subjectDescription="Physical Setting Chemistry principles and concepts"
      apiEndpoint="chemistry"
      currentIndex={4}
      backgroundIndex={4}
    />
  );
}
