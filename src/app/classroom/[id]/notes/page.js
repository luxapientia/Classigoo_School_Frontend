import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ClassroomNotesMain from "@components/pages/classroom/notes/page";

export const metadata = {
  title: "Notes - Classigoo",
  description: "View and manage classroom notes",
};

export default async function ClassroomHomePage({ params }) {
  const session = await auth0.getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ClassroomNotesMain id={id} session={session} />
    </>
  );
}
