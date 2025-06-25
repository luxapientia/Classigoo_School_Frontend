import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Home - Classigoo",
  description: "View classroom home page",
};

export default async function ClassroomsPage({ params }) {
  const user = await getUser();
  const { id } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  } else {
    redirect(`/classroom/${id}/home`);
  }
}
