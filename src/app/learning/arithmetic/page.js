import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import MainArithmeticComponent from "@components/pages/learning/activities/Arithmetic";

export const metadata = {
  title: "Arithmetic - Learning - Classigoo",
  description: "Learn arithmetic operations with Classigoo",
};

export default async function ArithmeticPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return <MainArithmeticComponent user={user} />;
  } catch (error) {
    console.error(`Error in ArithmeticPage: ${error}`);
  }
} 