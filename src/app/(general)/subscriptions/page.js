import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import SubscriptionMainComponent from "@components/pages/subscriptions/main";

export const metadata = {
  title: "Subscriptions - Classigoo",
  description: "Manage your subscriptions",
};

export default async function SubscriptionPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <SubscriptionMainComponent user={session.user} />
    </>
  );
}
