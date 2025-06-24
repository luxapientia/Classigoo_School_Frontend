import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ChemistryMainComponent from "@components/pages/buddy/chemistry/main";

export const metadata = {
  title: "Chemistry Buddy - Classigoo",
  description: "Your AI Chemistry Study Buddy",
};

export default async function SettingsPage() {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <ChemistryMainComponent userInfo={user} />
    </>
  );
}
