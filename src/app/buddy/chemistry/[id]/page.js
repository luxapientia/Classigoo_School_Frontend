import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ChemistrySingleMainComponent from "@components/pages/buddy/chemistry/id/main";

export const metadata = {
  title: "Chemistry Buddy - Classigoo",
  description: "Your AI Chemistry Study Buddy",
};

export default async function SettingsPage({ params }) {
  const { id } = await params;
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ChemistrySingleMainComponent userInfo={user} id={id} />
    </>
  );
}
