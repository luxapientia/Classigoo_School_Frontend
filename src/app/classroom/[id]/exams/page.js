import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ClassroomExamsMain from "@components/pages/classroom/exams/main";

export default async function ClassroomHomePage({ params }) {
  const session = await auth0.getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ClassroomExamsMain id={id} session={session} />
    </>
  );
}
