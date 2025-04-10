import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Home - Classigoo",
  description: "Welcome to Classigoo",
};

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return <h1>Welcome, {session.user.name}!</h1>;
}
