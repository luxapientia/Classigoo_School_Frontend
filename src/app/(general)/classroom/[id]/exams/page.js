import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ClassroomExamsMain from "@components/pages/classroom/exams/main";

export const metadata = {
  title: "Exams - Classigoo",
  description: "View and manage your exams",
};

export default async function ClassroomHomePage({ params }) {
  const session = await auth0.getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ClassroomExamsMain id={id} session={session} />
    </>
  );
}
