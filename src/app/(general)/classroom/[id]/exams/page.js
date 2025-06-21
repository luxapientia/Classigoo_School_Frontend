import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ClassroomExamsMain from "@components/pages/classroom/exams/main";

export const metadata = {
  title: "Exams - Classigoo",
  description: "View and manage your exams",
};

export default async function ClassroomHomePage({ params }) {
  const user = await getUser();
  const { id } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ClassroomExamsMain id={id} userInfo={user} />
    </>
  );
}
