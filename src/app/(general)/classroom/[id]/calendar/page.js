import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ClassroomCalendarMain from "@components/pages/classroom/calendar/main";

export const metadata = {
  title: "Calendar - Classigoo",
  description: "Manage your calendar",
};

export default async function ClassroomHomePage({ params }) {
  const session = await auth0.getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ClassroomCalendarMain id={id} session={session} />
    </>
  );
}
