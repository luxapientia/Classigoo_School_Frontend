import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import LearningScreenDashboard from "@components/pages/learning/activities/LearningScreen/main";

export const metadata = {
  title: "Learning Screen - Classigoo",
  description: "Learning Screen activities dashboard",
};

export default async function LearningScreenPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <LearningScreenDashboard user={user} />;
  } catch (error) {
    console.error(`Error in LearningScreenDashboard: ${error}`);
  }
} 