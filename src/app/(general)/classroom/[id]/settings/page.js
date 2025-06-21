import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ClassroomSettingsMain from "@components/pages/classroom/settings/main";

export const metadata = {
  title: "Classroom Settings - Classigoo",
  description: "View and manage your classroom settings",
};

export default async function ClassroomHomePage({ params }) {
  const user = await getUser();
  const { id } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ClassroomSettingsMain id={id} userInfo={user} />
    </>
  );
}
