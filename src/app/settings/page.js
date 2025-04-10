import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import SettingsMainComponent from "@components/pages/settings/main";

export const metadata = {
  title: "Settings - Classigoo",
  description: "Manage your settings",
};

export default async function SettingsPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <SettingsMainComponent />
    </>
  );
}
