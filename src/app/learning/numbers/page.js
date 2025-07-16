import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import NumbersActivity from "@components/pages/learning/activities/Numbers";

export const metadata = {
  title: "Numbers - Learning - Classigoo",
  description: "Learn numbers with Classigoo",
};

export default async function NumbersPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <NumbersActivity user={user} />;
  } catch (error) {
    console.error(`Error in NumbersPage: ${error}`);
  }
} 