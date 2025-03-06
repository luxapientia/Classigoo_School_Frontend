import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ClassroomResultsMain from "@components/pages/classroom/results/main";

export default async function ClassroomHomePage({ params }) {
  const session = await auth0.getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ClassroomResultsMain id={id} session={session} />
    </>
  );
}
