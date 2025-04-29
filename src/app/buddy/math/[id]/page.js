import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import MathSingleMainComponent from "@components/pages/buddy/math/id/main";

export const metadata = {
  title: "Math Buddy - Classigoo",
  description: "Your AI Math Study Buddy",
};

export default async function SettingsPage({ params }) {
  const { id } = await params;
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <MathSingleMainComponent user={session.user} id={id} />
    </>
  );
}
