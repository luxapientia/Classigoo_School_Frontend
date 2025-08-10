import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import LifeScienceBiology from "@components/pages/learning/activities/RegentsExam/LifeScienceBiology";

export const metadata = {
  title: "Life Science Biology - Regents Exam - Classigoo",
  description: "Life Science Biology activity in Regents Exam",
};

export default async function LifeScienceBiologyPage({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <LifeScienceBiology user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in LifeScienceBiologyPage: ${error}`);
  }
}
