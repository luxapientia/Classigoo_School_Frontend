import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ClassroomHomeMain from "@components/pages/classroom/home/main";

export default async function ClassroomHomePage({ params }) {
  const session = await auth0.getSession();
  const { id } = params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ClassroomHomeMain id={id} />
    </>
  );
}
