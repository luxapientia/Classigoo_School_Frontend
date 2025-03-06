import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ExamTakerMainComponent from "@components/pages/classroom/exam/eid/start/sid/main";

export default async function ClassroomSingleExam({ params }) {
  const session = await auth0.getSession();
  const { id, eid, sid } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ExamTakerMainComponent cid={id} eid={eid} sid={sid} user={session.user} />
    </>
  );
}
