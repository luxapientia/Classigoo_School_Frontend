import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ClassroomNotesMain from "@components/pages/classroom/notes/page";

export const metadata = {
  title: "Notes - Classigoo",
  description: "View and manage classroom notes",
};

export default async function ClassroomHomePage({ params }) {
  const user = await getUser();
  const { id } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ClassroomNotesMain id={id} userInfo={user} />
    </>
  );
}
