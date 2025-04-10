import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ClassroomSettingsMain from "@components/pages/classroom/settings/main";

export const metadata = {
  title: "Classroom Settings - Classigoo",
  description: "View and manage your classroom settings",
};

export default async function ClassroomHomePage({ params }) {
  const session = await auth0.getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ClassroomSettingsMain id={id} session={session} />
    </>
  );
}
