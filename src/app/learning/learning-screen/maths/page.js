import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import MathsSelect from "@components/pages/learning/activities/MathsSelect";

export const metadata = {
  title: "Maths - Learning Screen - Classigoo",
  description: "Maths activity in Learning Screen",
};

export default async function MathsPage({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <MathsSelect user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in MathsPage: ${error}`);
  }
} 