import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import AssignmentCreateMainComponent from "@components/pages/classroom/assignment/create/main";

export default async function AssignmentCreatePage({ params }) {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { id } = await params;

  return (
    <>
      <AssignmentCreateMainComponent classId={id} user={session.user} />
    </>
  );
}
