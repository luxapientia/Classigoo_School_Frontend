import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import LongVowelsDashboard from "@components/pages/learning/activities/LongVowelsDashboard";

export const metadata = {
  title: "Long Vowels - Classigoo",
  description: "Learn long vowels with Classigoo",
};

export default async function LongVowelsPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return (
      <>
        <LongVowelsDashboard user={user} />
      </>
    );
  } catch (error) {
    console.error(`Error in longVowelsPage: ${error}`);
  }
} 