import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import Subtraction2Activity from "@components/pages/learning/activities/Subtraction2";

export const metadata = {
  title: "Two-digit Subtraction - Arithmetic - Learning - Classigoo",
  description: "Practice two-digit subtraction problems with Classigoo",
};

export default async function Subtraction2Page() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <Subtraction2Activity user={user} />;
  } catch (error) {
    console.error(`Error in Subtraction2Page: ${error}`);
  }
} 