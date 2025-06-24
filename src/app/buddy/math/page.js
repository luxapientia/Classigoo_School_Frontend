import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import MathMainComponent from "@components/pages/buddy/math/main";

export const metadata = {
  title: "Math Buddy - Classigoo",
  description: "Your AI Math Study Buddy",
};

export default async function SettingsPage() {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <MathMainComponent userInfo={user} />
    </>
  );
}
