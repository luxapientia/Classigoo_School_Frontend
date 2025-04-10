import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ClassroomMembersMain from "@components/pages/classroom/members/main";

export const metadata = {
  title: "Members - Classigoo",
  description: "View classroom members",
};

export default async function ClassroomHomePage({ params }) {
  const session = await auth0.getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ClassroomMembersMain id={id} session={session} />
    </>
  );
}
