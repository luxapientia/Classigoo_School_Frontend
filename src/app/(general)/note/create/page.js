import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import NoteCreateMainComponent from "@components/pages/note/create/main";

export const metadata = {
  title: "Create Note - Classigoo",
  description: "Create a new note",
};

export default async function SettingsPage() {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <NoteCreateMainComponent userInfo={user} />
    </>
  );
}
