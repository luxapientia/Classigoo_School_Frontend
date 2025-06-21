import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ExamTakerMainComponent from "@components/pages/classroom/exam/eid/start/sid/main";

export const metadata = {
  title: "Take Exam - Classigoo",
  description: "Take your exam",
};

export default async function ClassroomSingleExam({ params }) {
  const user = await getUser();
  const { id, eid, sid } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ExamTakerMainComponent cid={id} eid={eid} sid={sid} userInfo={user} />
    </>
  );
}
