import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ClassroomMessagesMain from "@components/pages/classroom/messages/main";

export const metadata = {
  title: "Messages - Classigoo",
  description: "View and manage your messages",
};

export default async function ClassroomMessagesPage({ params }) {
  const user = await getUser();
  const { id } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ClassroomMessagesMain id={id} userInfo={user} />
    </>
  );
}
