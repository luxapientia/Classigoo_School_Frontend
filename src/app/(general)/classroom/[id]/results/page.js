import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ClassroomResultsMain from "@components/pages/classroom/results/main";

export const metadata = {
  title: "Results - Classigoo",
  description: "View and manage your results",
};

export default async function ClassroomHomePage({ params }) {
  const user = await getUser();
  const { id } = await params;

  if (!user) {
    redirect("/api/logout");
  }

  return (
    <>
      <ClassroomResultsMain id={id} userInfo={user} />
    </>
  );
}
