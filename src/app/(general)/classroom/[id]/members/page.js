import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ClassroomMembersMain from "@components/pages/classroom/members/main";


export const metadata = {
  title: "Members - Classigoo",
  description: "View classroom members",
};

export default async function ClassroomHomePage({ params }) {
  const user = await getUser();
  const { id } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ClassroomMembersMain id={id} userInfo={user} />
    </>
  );
}
