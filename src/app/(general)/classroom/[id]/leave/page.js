import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import Loading from "@components/common/loading";
import LeaveClassRoomMain from "@components/pages/classroom/leave/main";

export const metadata = {
  title: "Leave Classroom - Classigoo",
  description: "Leave your classroom",
};

export default async function LeaveClassRoom({ params }) {
  const user = await getUser();
  const { id } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <LeaveClassRoomMain id={id} userInfo={user} />
    </>
  );
}
