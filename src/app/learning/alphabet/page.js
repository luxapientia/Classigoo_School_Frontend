import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import AlphabetActivity from "@components/pages/learning/activities/Alphabet";

export const metadata = {
  title: "Alphabet - Learning - Classigoo",
  description: "Learn the alphabet with Classigoo",
};

export default async function AlphabetPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <AlphabetActivity user={user} />;
  } catch (error) {
    console.error(`Error in AlphabetPage: ${error}`);
  }
} 