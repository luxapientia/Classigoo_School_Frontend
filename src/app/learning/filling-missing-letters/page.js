import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import FillingMissingLettersActivity from "@components/pages/learning/activities/FillingMissingLetters";

export const metadata = {
  title: "Filling Missing Letters - Learning - Classigoo",
  description: "Fill in the missing letters to complete words with Classigoo",
};

export default async function FillingMissingLettersPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <FillingMissingLettersActivity user={user} />;
  } catch (error) {
    console.error(`Error in FillingMissingLettersPage: ${error}`);
  }
} 