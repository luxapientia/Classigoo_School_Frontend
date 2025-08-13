import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import PhysicalSettingPhysics from "@components/pages/learning/activities/RegentsExam/PhysicalSettingPhysics";

export const metadata = {
  title: "Physical Setting Physics - Regents Exam - Classigoo",
  description: "Physical Setting Physics activity in Regents Exam",
};

export default async function PhysicalSettingPhysicsPage({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <PhysicalSettingPhysics user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in PhysicalSettingPhysicsPage: ${error}`);
  }
}
