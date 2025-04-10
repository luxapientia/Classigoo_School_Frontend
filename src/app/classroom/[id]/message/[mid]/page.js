import ClassroomMessageSingle from "@components/pages/classroom/message/mid/main";
import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
// import ClassroomNotesMain from "@components/pages/classroom/notes/page";

export const metadata = {
  title: "Message - Classigoo",
  description: "View and manage your messages",
};

export default async function ClassroomMessagesPage({ params }) {
  const session = await auth0.getSession();
  const { id, mid } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return <>{<ClassroomMessageSingle cid={id} mid={mid} user={session.user} />}</>;
}
