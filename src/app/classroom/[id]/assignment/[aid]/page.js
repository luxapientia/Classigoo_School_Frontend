import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ClassroomHomeMain from "@components/pages/classroom/home/main";
import AssignmentPageMainComponent from "@components/pages/classroom/assignment/aid/main";

export default async function ClassroomSingleAssignment({ params }) {
  const session = await auth0.getSession();
  const { id, aid } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <AssignmentPageMainComponent cid={id} aid={aid} user={session.user} />
    </>
  );
}
