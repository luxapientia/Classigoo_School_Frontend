import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import AssignmentPageMainComponent from "@components/pages/classroom/assignment/aid/main";

export const metadata = {
  title: "Edit Assignment - Classigoo",
  description: "Edit your assignment",
};

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
