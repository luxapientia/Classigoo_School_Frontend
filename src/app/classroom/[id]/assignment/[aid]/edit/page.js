import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import AssignmentEditMainComponent from "@components/pages/classroom/assignment/aid/edit/main";

export const metadata = {
  title: "Edit Assignment - Classigoo",
  description: "Edit your assignment",
};

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
