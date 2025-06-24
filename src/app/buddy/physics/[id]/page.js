import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import PhysicsSingleMainComponent from "@components/pages/buddy/physics/id/main";

export const metadata = {
  title: "Physics Buddy - Classigoo",
  description: "Your AI Physics Study Buddy",
};

export default async function SettingsPage({ params }) {
  const { id } = await params;
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <PhysicsSingleMainComponent userInfo={user} id={id} />
    </>
  );
}
