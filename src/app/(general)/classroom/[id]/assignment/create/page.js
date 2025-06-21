import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import AssignmentCreateMainComponent from "@components/pages/classroom/assignment/create/main";

export const metadata = {
  title: "Create Assignment - Classigoo",
  description: "Create your assignment",
};

export default async function AssignmentCreatePage({ params }) {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  const { id } = await params;

  return (
    <>
      <AssignmentCreateMainComponent classId={id} userInfo={user} />
    </>
  );
}
