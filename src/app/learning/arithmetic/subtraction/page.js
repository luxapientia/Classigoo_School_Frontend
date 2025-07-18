import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import SubtractionActivity from "@components/pages/learning/activities/Subtraction";

export const metadata = {
  title: "Subtraction - Arithmetic - Learning - Classigoo",
  description: "Practice subtraction problems with Classigoo",
};

export default async function SubtractionPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <SubtractionActivity user={user} />;
  } catch (error) {
    console.error(`Error in SubtractionPage: ${error}`);
  }
} 