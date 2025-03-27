import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ClassroomMessagesMain from "@components/pages/classroom/messages/main";

export default async function ClassroomMessagesPage({ params }) {
  const session = await auth0.getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ClassroomMessagesMain id={id} session={session} />
    </>
  );
}
