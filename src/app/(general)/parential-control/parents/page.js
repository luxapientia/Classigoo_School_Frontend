import React from "react";
import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import MainParentComponent from "@components/pages/parential-control/parent/main";

export default async function ChildrenPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <MainParentComponent user={session.user} />
    </>
  );
}
