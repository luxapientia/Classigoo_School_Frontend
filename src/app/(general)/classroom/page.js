import { redirect } from "next/navigation";
import { getUser } from "@lib/auth";

export const metadata = {
  title: "Classrooms - Classigoo",
  description: "View and manage your classrooms",
};

export default async function classroomsPage() {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  } else {
    redirect("/classrooms");
  }
}
