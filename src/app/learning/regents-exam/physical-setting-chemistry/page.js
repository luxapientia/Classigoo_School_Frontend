import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import PhysicalSettingChemistry from "@components/pages/learning/activities/RegentsExam/PhysicalSettingchemistry";

export const metadata = {
  title: "Physical Setting Chemistry - Regents Exam - Classigoo",
  description: "Physical Setting Chemistry activity in Regents Exam",
};

export default async function PhysicalSettingChemistryPage({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <PhysicalSettingChemistry user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in PhysicalSettingChemistryPage: ${error}`);
  }
}
