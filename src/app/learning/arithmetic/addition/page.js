import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import AdditionActivity from "@components/pages/learning/activities/Addition";

export const metadata = {
  title: "Addition - Arithmetic - Learning - Classigoo",
  description: "Practice addition problems with Classigoo",
};

export default async function AdditionPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <AdditionActivity user={user} />;
  } catch (error) {
    console.error(`Error in AdditionPage: ${error}`);
  }
} 