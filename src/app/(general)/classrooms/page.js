import React from "react";
import { redirect } from "next/navigation";
import MainClassroomsComponent from "@components/pages/classrooms/main";
import { getUser } from "@lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Classrooms - Classigoo",
  description: "Manage your classrooms",
};

export default async function classroomsPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

    return (
      <>
        <MainClassroomsComponent user={user} />
      </>
    );
  } catch (error) {
    console.error(`Error in classroomsPage: ${error}`);
  }
}
