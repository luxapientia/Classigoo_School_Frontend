import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ExamUpdateMainComponent from "@components/pages/classroom/exam/eid/edit/main";

export const metadata = {
  title: "Edit Exam - Classigoo",
  description: "Edit your exam",
};

export default async function ClassroomSingleAssignmentEdit({ params }) {
  const user = await getUser();
  const { id, eid } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ExamUpdateMainComponent cid={id} eid={eid} userInfo={user} />
    </>
  );
}
