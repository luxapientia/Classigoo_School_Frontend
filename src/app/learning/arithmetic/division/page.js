import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import DivisionActivity from "@components/pages/learning/activities/Division";

export const metadata = {
  title: "Division - Arithmetic - Learning - Classigoo",
  description: "Practice division problems with Classigoo",
};

export default async function DivisionPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <DivisionActivity user={user} />;
  } catch (error) {
    console.error(`Error in DivisionPage: ${error}`);
  }
} 