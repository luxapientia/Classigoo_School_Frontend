import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import AssignmentEditMainComponent from "@components/pages/classroom/assignment/aid/edit/main";

export const metadata = {
  title: "Edit Assignment - Classigoo",
  description: "Edit your assignment",
};

export default async function ClassroomSingleAssignmentEdit({ params }) {
  const user = await getUser();
  const { id, aid } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <AssignmentEditMainComponent cid={id} aid={aid} userInfo={user} />
    </>
  );
}
