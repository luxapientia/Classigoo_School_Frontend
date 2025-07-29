import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import NewWord from "@components/pages/learning/activities/NewWord";

export const metadata = {
  title: "New Word - Learning Screen - Classigoo",
  description: "New Word activity in Learning Screen",
};

export default async function NewWordPage({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <NewWord user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in NewWordPage: ${error}`);
  }
} 