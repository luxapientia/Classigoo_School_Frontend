import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import Loading from "@components/common/loading";
import LeaveClassRoomMain from "@components/pages/classroom/leave/main";

export default async function LeaveClassRoom({ params }) {
  const session = await auth0.getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <LeaveClassRoomMain id={id} session={session} />
    </>
  );
}
