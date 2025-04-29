import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import ChemistrySingleMainComponent from "@components/pages/buddy/chemistry/id/main";

export const metadata = {
  title: "Chemistry Buddy - Classigoo",
  description: "Your AI Chemistry Study Buddy",
};

export default async function SettingsPage({ params }) {
  const { id } = await params;
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <ChemistrySingleMainComponent user={session.user} id={id} />
    </>
  );
}
