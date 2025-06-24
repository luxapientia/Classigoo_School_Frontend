import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import PhysicsMainComponent from "@components/pages/buddy/physics/main";

export const metadata = {
  title: "Physics Buddy - Classigoo",
  description: "Your AI Physics Study Buddy",
};

export default async function SettingsPage() {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <PhysicsMainComponent userInfo={user} />
    </>
  );
}
