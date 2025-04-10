import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import NoteCreateMainComponent from "@components/pages/note/create/main";

export const metadata = {
  title: "Create Note - Classigoo",
  description: "Create a new note",
};

export default async function SettingsPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <NoteCreateMainComponent user={session.user} />
    </>
  );
}
