import { redirect } from "next/navigation";
import { getUser } from "@lib/auth";
import DashboardMain from "@components/pages/dashboard/main";

export const metadata = {
  title: "Dashboard - Classigoo",
  description: "Welcome to Classigoo Dashboard",
};

export default async function Home() {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return <DashboardMain user={user} />;
}
