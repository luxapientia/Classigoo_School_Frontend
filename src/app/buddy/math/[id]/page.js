import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import MathSingleMainComponent from "@components/pages/buddy/math/id/main";

export const metadata = {
  title: "Math Buddy - Classigoo",
  description: "Your AI Math Study Buddy",
};

export default async function SettingsPage({ params }) {
  const { id } = await params;
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <MathSingleMainComponent userInfo={user} id={id} />
    </>
  );
}
