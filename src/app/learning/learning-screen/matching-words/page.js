import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import MatchingWordSelect from "@components/pages/learning/activities/MatchingWordSelect";

export const metadata = {
  title: "Matching Words - Learning Screen - Classigoo",
  description: "Matching Words activity in Learning Screen",
};

export default async function MatchingWordsPage({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <MatchingWordSelect user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in MatchingWordsPage: ${error}`);
  }
} 