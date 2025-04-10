import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ExamSubmissionSeeMainComponent from "@components/pages/classroom/exam/eid/submission/sid/main";

export const metadata = {
  title: "See Exam Submission - Classigoo",
  description: "See your exam submission",
};

export default async function ClassroomSingleExam({ params }) {
  const session = await auth0.getSession();
  const { id, eid, sid } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ExamSubmissionSeeMainComponent cid={id} eid={eid} sid={sid} user={session.user} />
    </>
  );
}
