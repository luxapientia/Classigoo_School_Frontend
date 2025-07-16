import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import MainLearningComponent from "@components/pages/learning/main";

export const metadata = {
  title: "Learning - Classigoo",
  description: "Learn with Classigoo and get better grades",
};

export default async function LearningPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return (
      <>
        <MainLearningComponent user={user} />
      </>
    );
  } catch (error) {
    console.error(`Error in learningPage: ${error}`);
  }
}
