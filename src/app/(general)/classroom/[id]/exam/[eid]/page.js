import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ExamPageMainComponent from "@components/pages/classroom/exam/eid/main";

export const metadata = {
  title: "Exam - Classigoo",
  description: "Exam",
};

export default async function ClassroomSingleExam({ params }) {
  const user = await getUser();
  const { id, eid } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ExamPageMainComponent cid={id} eid={eid} userInfo={user} />
    </>
  );
}
