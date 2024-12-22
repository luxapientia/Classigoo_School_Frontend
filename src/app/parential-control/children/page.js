import React from "react";
import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import MainChildComponent from "@components/pages/parential-control/child/main";

export default async function ChildrenPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <MainChildComponent user={session.user} />
    </>
  );
}
