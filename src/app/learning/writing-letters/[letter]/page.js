import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import LetterActivity from "@components/pages/learning/activities/LetterActivity";

export const metadata = {
  title: "Letter Writing - Learning - Classigoo",
  description: "Learn to write letters of the alphabet with Classigoo",
};

export default async function LetterPage({ params }) {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    const { letter } = await params;
    
    // Validate letter parameter
    if (!letter || !/^[a-z]$/.test(letter)) {
      redirect("/learning/writing-letters");
    }

    return <LetterActivity letter={letter} user={user} />;
  } catch (error) {
    console.error(`Error in LetterPage: ${error}`);
  }
} 