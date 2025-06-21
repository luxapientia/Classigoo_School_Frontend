import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ExamSubmissionSeeMainComponent from "@components/pages/classroom/exam/eid/submission/sid/main";

export const metadata = {
  title: "See Exam Submission - Classigoo",
  description: "See your exam submission",
};

export default async function ClassroomSingleExam({ params }) {
  const user = await getUser();
  const { id, eid, sid } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ExamSubmissionSeeMainComponent cid={id} eid={eid} sid={sid} userInfo={user} />
    </>
  );
}
