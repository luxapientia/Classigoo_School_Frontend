import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import RegentsExamDashboard from "@components/pages/learning/activities/RegentsExam/main";

export const metadata = {
  title: "NYS Regents Exams - Classigoo",
  description: "NYS Regents Exam activities dashboard",
};

export default async function RegentsExamPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <RegentsExamDashboard user={user} />;
  } catch (error) {
    console.error(`Error in RegentsExamDashboard: ${error}`);
  }
}
