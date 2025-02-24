import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ClassroomAssignmentsMain from "@components/pages/classroom/assignments/main";

export default async function ClassroomHomePage({ params }) {
  const session = await auth0.getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ClassroomAssignmentsMain id={id} session={session} />
    </>
  );
}
