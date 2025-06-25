import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import NotePageMainComponent from "@components/pages/note/id/main";

export const metadata = {
  title: "Note - Classigoo",
  description: "Manage your note",
};

export default async function SettingsPage({ params }) {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  const { id } = await params;

  return (
    <>
      <NotePageMainComponent userInfo={user} id={id} />
    </>
  );
}
