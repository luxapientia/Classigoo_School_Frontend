import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import LongVowelActivity from "@components/pages/learning/activities/LongVowelActivity";

export const metadata = {
  title: "Long Vowel Activity - Classigoo",
  description: "Practice long vowels with Classigoo",
};

export default async function LongVowelPage({ params }) {
  try {
    const user = await getUser();
    const { vowel } = await params;

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return (
      <>
        <LongVowelActivity user={user} vowel={vowel} />
      </>
    );
  } catch (error) {
    console.error(`Error in longVowelPage: ${error}`);
  }
} 