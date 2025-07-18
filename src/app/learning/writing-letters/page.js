import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import WritingLettersDashboard from "@components/pages/learning/activities/WritingLettersDashboard";

export const metadata = {
  title: "Writing Letters - Learning - Classigoo",
  description: "Learn to write letters of the alphabet with Classigoo",
};

export default async function WritingLettersPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <WritingLettersDashboard user={user} />;
  } catch (error) {
    console.error(`Error in WritingLettersPage: ${error}`);
  }
} 