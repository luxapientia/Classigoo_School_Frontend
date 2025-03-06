import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ExamCreateMainComponent from "@components/pages/classroom/exam/create/main";

export default async function AssignmentCreatePage({ params }) {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { id } = await params;

  return (
    <>
      <ExamCreateMainComponent id={id} user={session.user} />
    </>
  );
}
