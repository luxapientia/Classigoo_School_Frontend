import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import WordSearch from "@components/pages/learning/activities/WordSearch";

export const metadata = {
  title: "Word Search - Learning Screen - Classigoo",
  description: "Word Search activity in Learning Screen",
};

export default async function WordSearchPage() {
  try {
    const user = await getUser();
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <WordSearch user={user} />;
  } catch (error) {
    console.error(`Error in WordSearchPage: ${error}`);
  }
} 