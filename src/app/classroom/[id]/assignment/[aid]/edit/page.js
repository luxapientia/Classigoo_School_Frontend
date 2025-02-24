import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ClassroomHomeMain from "@components/pages/classroom/home/main";
import AssignmentPageMainComponent from "@components/pages/classroom/assignment/aid/main";
import AssignmentEditMainComponent from "@components/pages/classroom/assignment/aid/edit/main";

export default async function ClassroomSingleAssignmentEdit({ params }) {
  const session = await auth0.getSession();
  const { id, aid } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <AssignmentEditMainComponent cid={id} aid={aid} user={session.user} />
    </>
  );
}
