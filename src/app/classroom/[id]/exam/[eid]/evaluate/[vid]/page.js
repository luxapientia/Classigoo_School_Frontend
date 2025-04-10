import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ExamEvaluaterMainComponent from "@components/pages/classroom/exam/eid/evaluate/vid/main";

export const metadata = {
  title: "Evaluate Exam - Classigoo",
  description: "Evaluate your exam",
};

export default async function ClassroomSingleExam({ params }) {
  const session = await auth0.getSession();
  const { id, eid, vid } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ExamEvaluaterMainComponent cid={id} eid={eid} vid={vid} user={session.user} />
    </>
  );
}
