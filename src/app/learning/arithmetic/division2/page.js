import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import Division2Activity from "@components/pages/learning/activities/Division2";

export const metadata = {
  title: "Division 2-Digit - Arithmetic - Learning - Classigoo",
  description: "Practice 2-digit division problems with Classigoo",
};

export default async function Division2Page() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <Division2Activity user={user} />;
  } catch (error) {
    console.error(`Error in Division2Page: ${error}`);
  }
} 