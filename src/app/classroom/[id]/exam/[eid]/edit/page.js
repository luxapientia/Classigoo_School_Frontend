import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ExamUpdateMainComponent from "@components/pages/classroom/exam/eid/edit/main";

export const metadata = {
  title: "Edit Exam - Classigoo",
  description: "Edit your exam",
};

export default async function ClassroomSingleAssignmentEdit({ params }) {
  const session = await auth0.getSession();
  const { id, eid } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ExamUpdateMainComponent id={id} eid={eid} user={session.user} />
    </>
  );
}
