import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import NotePageMainComponent from "@components/pages/note/id/main";

export default async function SettingsPage({ params }) {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { id } = await params;

  return (
    <>
      <NotePageMainComponent user={session.user} id={id} />
    </>
  );
}
