import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ExamCreateMainComponent from "@components/pages/classroom/exam/create/main";

export const metadata = {
  title: "Create Exam - Classigoo",
  description: "Create your exam",
};

export default async function AssignmentCreatePage({ params }) {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  const { id } = await params;

  return (
    <>
      <ExamCreateMainComponent classId={id} userInfo={user} />
    </>
  );
}
