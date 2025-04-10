import React from "react";
import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import MainClassroomsComponent from "@components/pages/classrooms/main";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Classrooms - Classigoo",
  description: "Manage your classrooms",
};

export default async function classroomsPage() {
  try {
    const session = await auth0.getSession();

    if (!session) {
      redirect("/auth/login");
    }

    return (
      <>
        <MainClassroomsComponent user={session.user} />
      </>
    );
  } catch (error) {
    console.error(`Error in classroomsPage: ${error}`);
  }
}
