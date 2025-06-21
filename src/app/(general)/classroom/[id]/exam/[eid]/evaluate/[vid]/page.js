import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ExamEvaluaterMainComponent from "@components/pages/classroom/exam/eid/evaluate/vid/main";

export const metadata = {
  title: "Evaluate Exam - Classigoo",
  description: "Evaluate your exam",
};

export default async function ClassroomSingleExam({ params }) {
  const user = await getUser();
  const { id, eid, vid } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ExamEvaluaterMainComponent cid={id} eid={eid} vid={vid} userInfo={user} />
    </>
  );
}
