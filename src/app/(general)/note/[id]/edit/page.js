import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import NoteEditMainComponent from "@components/pages/note/id/edit/main";

export const metadata = {
  title: "Edit Note - Classigoo",
  description: "Edit your note",
};

export default async function SettingsPage({ params }) {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  const { id } = await params;

  return (
    <>
      <NoteEditMainComponent userInfo={user} id={id} />
    </>
  );
}
