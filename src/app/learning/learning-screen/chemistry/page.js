import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ChemistrySelect from "@components/pages/learning/activities/ChemistrySelect";

export const metadata = {
  title: "Chemistry - Learning Screen - Classigoo",
  description: "Chemistry activity in Learning Screen",
};

export default async function ChemistryPage({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <ChemistrySelect user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in ChemistryPage: ${error}`);
  }
} 