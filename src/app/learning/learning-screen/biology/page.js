import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import BiologySelect from "@components/pages/learning/activities/BiologySelect";

export const metadata = {
  title: "Biology - Learning Screen - Classigoo",
  description: "Biology activity in Learning Screen",
};

export default async function BiologyPage({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <BiologySelect user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in BiologyPage: ${error}`);
  }
} 