import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import EarthSpaceScience from "@components/pages/learning/activities/RegentsExam/EarthSpaceScience";

export const metadata = {
  title: "Earth and Space Sciences - Regents Exam - Classigoo",
  description: "Earth and Space Sciences activity in Regents Exam",
};

export default async function EarthSpaceSciencePage({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <EarthSpaceScience user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in EarthSpaceSciencePage: ${error}`);
  }
}
