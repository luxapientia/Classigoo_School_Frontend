import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import PhysicsSingleMainComponent from "@components/pages/buddy/physics/id/main";

export const metadata = {
  title: "Physics Buddy - Classigoo",
  description: "Your AI Physics Study Buddy",
};

export default async function SettingsPage({ params }) {
  const { id } = await params;
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <PhysicsSingleMainComponent user={session.user} id={id} />
    </>
  );
}
