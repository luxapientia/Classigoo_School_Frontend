import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import Multiplication2Activity from "@components/pages/learning/activities/Multiplication2";

export const metadata = {
  title: "Multiplication 2-Digit - Arithmetic - Learning - Classigoo",
  description: "Practice 2-digit multiplication problems with Classigoo",
};

export default async function Multiplication2Page() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <Multiplication2Activity user={user} />;
  } catch (error) {
    console.error(`Error in Multiplication2Page: ${error}`);
  }
} 