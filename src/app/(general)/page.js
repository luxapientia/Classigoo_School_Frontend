import { redirect } from "next/navigation";
import { getUser } from "@lib/auth";

export const metadata = {
  title: "Home - Classigoo",
  description: "Welcome to Classigoo",
};

export default async function Home() {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return <h1>Welcome, {user.name}!</h1>;
}
