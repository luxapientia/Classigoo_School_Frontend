import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import AssignmentPageMainComponent from "@components/pages/classroom/assignment/aid/main";

export const metadata = {
  title: "Edit Assignment - Classigoo",
  description: "Edit your assignment",
};

export default async function ClassroomSingleAssignment({ params }) {
  const user = await getUser();
  const { id, aid } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <AssignmentPageMainComponent cid={id} aid={aid} userInfo={user} />
    </>
  );
}
