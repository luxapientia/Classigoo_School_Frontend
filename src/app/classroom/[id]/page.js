import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";

export default async function ClassroomsPage({ params }) {
  const session = await auth0.getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  } else {
    redirect(`/classroom/${id}/home`);
  }
}
