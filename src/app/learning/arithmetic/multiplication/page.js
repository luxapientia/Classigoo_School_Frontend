import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import MultiplicationActivity from "@components/pages/learning/activities/Multiplication";

export const metadata = {
  title: "Multiplication - Arithmetic - Learning - Classigoo",
  description: "Practice multiplication problems with Classigoo",
};

export default async function MultiplicationPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <MultiplicationActivity user={user} />;
  } catch (error) {
    console.error(`Error in MultiplicationPage: ${error}`);
  }
} 