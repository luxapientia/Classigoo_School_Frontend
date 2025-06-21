import { getUser } from "@lib/auth";
import ClassroomMessageSingle from "@components/pages/classroom/message/mid/main";
import { redirect } from "next/navigation";

// import ClassroomNotesMain from "@components/pages/classroom/notes/page";

export const metadata = {
  title: "Message - Classigoo",
  description: "View and manage your messages",
};

export default async function ClassroomMessagesPage({ params }) {
  const user = await getUser();
  const { id, mid } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return <>{<ClassroomMessageSingle cid={id} mid={mid} userInfo={user} />}</>;
}
