import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import LongDivisionActivity from "@components/pages/learning/activities/LongDivision";

export const metadata = {
  title: "Long Division - Arithmetic - Learning - Classigoo",
  description: "Practice long division problems with Classigoo",
};

export default async function LongDivisionPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <LongDivisionActivity user={user} />;
  } catch (error) {
    console.error(`Error in LongDivisionPage: ${error}`);
  }
} 