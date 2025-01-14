import React from "react";
import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import MainClassroomsComponent from "@components/pages/classrooms/main";

export default async function classroomsPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <MainClassroomsComponent user={session.user} />
    </>
  );
}
