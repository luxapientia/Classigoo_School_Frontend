import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import NotesMainComponent from "@components/pages/notes/main";

export const metadata = {
  title: "Notes - Classigoo",
  description: "Manage your notes",
};

export default async function SettingsPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <NotesMainComponent user={session.user} />
    </>
  );
}
