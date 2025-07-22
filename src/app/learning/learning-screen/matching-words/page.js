import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import MatchingWordSelect from "@components/pages/learning/activities/MatchingWordSelect";

export const metadata = {
  title: "Matching Words - Learning Screen - Classigoo",
  description: "Matching Words activity in Learning Screen",
};

export default async function MatchingWordsPage() {
  try {
    const user = await getUser();
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <MatchingWordSelect user={user} />;
  } catch (error) {
    console.error(`Error in MatchingWordsPage: ${error}`);
  }
} 