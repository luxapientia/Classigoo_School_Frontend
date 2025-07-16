import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ABCGamesActivity from "@components/pages/learning/activities/ABCGames";

export const metadata = {
  title: "ABC Games - Learning - Classigoo",
  description: "Learn the alphabet with fun games on Classigoo",
};

export default async function ABCGamesPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <ABCGamesActivity user={user} />;
  } catch (error) {
    console.error(`Error in ABCGamesPage: ${error}`);
  }
} 