import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import CompleteWord from "@components/pages/learning/activities/CompleteWord";

export const metadata = {
  title: "Complete Word - Learning Screen - Classigoo",
  description: "Complete Word activity in Learning Screen",
};

export default async function CompleteWordPage({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <CompleteWord user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in CompleteWordPage: ${error}`);
  }
} 