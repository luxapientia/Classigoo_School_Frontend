import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import MatchingShape from "@components/pages/learning/activities/MatchingShape";

export const metadata = {
  title: "Matching Shape - Learning Screen - Classigoo",
  description: "Matching Shape activity in Learning Screen",
};

export default async function MatchingShapePage({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <MatchingShape user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in MatchingShapePage: ${error}`);
  }
} 