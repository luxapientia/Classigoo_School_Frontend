import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ClassroomHomeMain from "@components/pages/classroom/home/main";

export const metadata = {
  title: "Classroom Home - Classigoo",
  description: "Welcome to your classroom",
};

export default async function ClassroomHomePage({ params }) {
  const user = await getUser();
  const { id } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ClassroomHomeMain id={id} userInfo={user} />
    </>
  );
}
