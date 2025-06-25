import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import NotesMainComponent from "@components/pages/notes/main";

export const metadata = {
  title: "Notes - Classigoo",
  description: "Manage your notes",
};

export default async function SettingsPage() {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <NotesMainComponent userInfo={user} />
    </>
  );
}
