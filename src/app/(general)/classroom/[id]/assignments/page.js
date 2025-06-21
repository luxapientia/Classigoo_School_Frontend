import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ClassroomAssignmentsMain from "@components/pages/classroom/assignments/main";

export const metadata = {
  title: "Assignments - Classigoo",
  description: "Manage your assignments",
};

export default async function ClassroomHomePage({ params }) {
  const user = await getUser();
  const { id } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ClassroomAssignmentsMain id={id} userInfo={user} />
    </>
  );
}
