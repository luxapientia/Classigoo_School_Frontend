import React from "react";
import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import MainParentComponent from "@components/pages/parential-control/parent/main";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Parential Control - Parents - Classigoo",
  description: "Manage your parents",
};

export default async function ParentsPage() {
  try {
    const user = await getUser();

    if (!user || (user.status === "error" && user.message === "Unauthorized")) {
      redirect("/api/logout");
    }

  return (
    <>
        <MainParentComponent user={user} />
      </>
    );
  } catch (error) {
    console.error(`Error in ParentsPage: ${error}`);
  }
}
