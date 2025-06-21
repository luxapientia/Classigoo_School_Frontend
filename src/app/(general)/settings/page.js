import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import SettingsMainComponent from "@components/pages/settings/main";

export const metadata = {
  title: "Settings - Classigoo",
  description: "Manage your settings",
};

export default async function SettingsPage() {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <SettingsMainComponent />
    </>
  );
}
