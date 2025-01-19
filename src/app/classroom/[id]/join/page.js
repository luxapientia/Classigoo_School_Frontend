import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import Loading from "@components/common/loading";
import JoinClassRoomMain from "@components/pages/classroom/join/main";

export default async function JoinClassRoom({ params }) {
  const session = await auth0.getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <JoinClassRoomMain id={id} session={session} />
    </>
  );
}
