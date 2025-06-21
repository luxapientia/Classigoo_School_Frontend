import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import SubscriptionMainComponent from "@components/pages/subscriptions/main";

export const metadata = {
  title: "Subscriptions - Classigoo",
  description: "Manage your subscriptions",
};

export default async function SubscriptionPage() {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <SubscriptionMainComponent user={user} />
    </>
  );
}
