import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import SightWords from "@components/pages/learning/activities/SightWords";

export const metadata = {
  title: "Sight Words - Learning Screen - Classigoo",
  description: "Sight Words activity in Learning Screen",
};

export default async function SightWordsPage() {
  try {
    const user = await getUser();
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <SightWords user={user} />;
  } catch (error) {
    console.error(`Error in SightWordsPage: ${error}`);
  }
} 