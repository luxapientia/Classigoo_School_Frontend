import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ClassroomHomeMain from "@components/pages/classroom/home/main";

export const metadata = {
  title: "Classroom Home - Classigoo",
  description: "Welcome to your classroom",
};

export default async function ClassroomHomePage({ params }) {
  const session = await auth0.getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ClassroomHomeMain id={id} session={session} />
    </>
  );
}
