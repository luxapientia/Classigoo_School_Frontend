import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import Algebra1 from "@components/pages/learning/activities/RegentsExam/Algebra1";

export const metadata = {
  title: "Algebra I - Regents Exam - Classigoo",
  description: "Algebra I activity in Regents Exam",
};

export default async function Algebra1Page({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <Algebra1 user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in Algebra1Page: ${error}`);
  }
}
