import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import PhysicalEarthScience from "@components/pages/learning/activities/RegentsExam/PhysicalEarthScience";

export const metadata = {
  title: "Physical Setting Earth Science - Regents Exam - Classigoo",
  description: "Physical Setting Earth Science activity in Regents Exam",
};

export default async function PhysicalEarthSciencePage({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <PhysicalEarthScience user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in PhysicalEarthSciencePage: ${error}`);
  }
}
