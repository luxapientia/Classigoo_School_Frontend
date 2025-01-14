import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";

export default async function classroomsPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  } else {
    redirect("/classrooms");
  }
}
