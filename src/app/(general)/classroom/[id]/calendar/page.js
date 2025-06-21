import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ClassroomCalendarMain from "@components/pages/classroom/calendar/main";

export const metadata = {
  title: "Calendar - Classigoo",
  description: "Manage your calendar",
};

export default async function ClassroomHomePage({ params }) {
  const user = await getUser();
  const { id } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ClassroomCalendarMain id={id} userInfo={user} />
    </>
  );
}
