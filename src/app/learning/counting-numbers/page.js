import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import CountingNumbersActivity from "@components/pages/learning/activities/CountingNumbers";

export const metadata = {
  title: "Counting Numbers - Learning - Classigoo",
  description: "Learn to count numbers with Classigoo",
};

export default async function CountingNumbersPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <CountingNumbersActivity user={user} />;
  } catch (error) {
    console.error(`Error in CountingNumbersPage: ${error}`);
  }
} 