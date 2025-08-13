import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import LivingEnvironment from "@components/pages/learning/activities/RegentsExam/LivingEnvironment";

export const metadata = {
  title: "Living Environment - Regents Exam - Classigoo",
  description: "Living Environment activity in Regents Exam",
};

export default async function LivingEnvironmentPage({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <LivingEnvironment user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in LivingEnvironmentPage: ${error}`);
  }
}
