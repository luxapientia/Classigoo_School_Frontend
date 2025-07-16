import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import NumberGamesActivity from "@components/pages/learning/activities/NumberGames";

export const metadata = {
  title: "Number Games - Learning - Classigoo",
  description: "Learn numbers with fun games on Classigoo",
};

export default async function NumberGamesPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <NumberGamesActivity user={user} />;
  } catch (error) {
    console.error(`Error in NumberGamesPage: ${error}`);
  }
} 