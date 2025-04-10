import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import NoteEditMainComponent from "@components/pages/note/id/edit/main";

export const metadata = {
  title: "Edit Note - Classigoo",
  description: "Edit your note",
};

export default async function SettingsPage({ params }) {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { id } = await params;

  return (
    <>
      <NoteEditMainComponent user={session.user} id={id} />
    </>
  );
}
