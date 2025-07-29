import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import PhysicsSelect from "@components/pages/learning/activities/PhysicsSelect";

export const metadata = {
  title: "Physics - Learning Screen - Classigoo",
  description: "Physics activity in Learning Screen",
};

export default async function PhysicsPage({ searchParams }) {
  try {
    const user = await getUser();
    const { grade } = await searchParams;
    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }
    return <PhysicsSelect user={user} grade={grade} />;
  } catch (error) {
    console.error(`Error in PhysicsPage: ${error}`);
  }
} 