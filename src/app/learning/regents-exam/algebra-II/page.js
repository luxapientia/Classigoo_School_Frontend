import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import Algebra2 from "@components/pages/learning/activities/RegentsExam/Algebra2";

export const metadata = {
  title: "Algebra II - Regents Exam - Classigoo",
  description: "Algebra II activity in Regents Exam",
};

export default async function Algebra2Page({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <Algebra2 user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in Algebra2Page: ${error}`);
  }
}
