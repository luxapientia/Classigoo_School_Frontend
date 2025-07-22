import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import Mathematics from "@components/pages/learning/activities/Mathematics";

export const metadata = {
  title: "Mathematics - Learning Screen - Classigoo",
  description: "Mathematics activity in Learning Screen",
};

export default async function MathematicsPage() {
  try {
    const user = await getUser();
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <Mathematics user={user} />;
  } catch (error) {
    console.error(`Error in MathematicsPage: ${error}`);
  }
} 