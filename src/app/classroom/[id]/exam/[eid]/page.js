import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ExamPageMainComponent from "@components/pages/classroom/exam/eid/main";

export const metadata = {
  title: "Exam - Classigoo",
  description: "Exam",
};

export default async function ClassroomSingleExam({ params }) {
  const session = await auth0.getSession();
  const { id, eid } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ExamPageMainComponent cid={id} eid={eid} user={session.user} />
    </>
  );
}
