import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import Addition2Activity from "@components/pages/learning/activities/Addition2";

export const metadata = {
  title: "Two-digit Addition - Arithmetic - Learning - Classigoo",
  description: "Practice two-digit addition problems with Classigoo",
};

export default async function Addition2Page() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <Addition2Activity user={user} />;
  } catch (error) {
    console.error(`Error in Addition2Page: ${error}`);
  }
} 