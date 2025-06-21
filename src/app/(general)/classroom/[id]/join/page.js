import { getUser } from "@lib/auth";
import { redirect } from "next/navigation";
import Loading from "@components/common/loading";
import JoinClassRoomMain from "@components/pages/classroom/join/main";

export const metadata = {
  title: "Join Classroom - Classigoo",
  description: "Join your classroom",
};

export default async function JoinClassRoom({ params }) {
  const user = await getUser();
  const { id } = await params;

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return (
    <>
      <JoinClassRoomMain id={id} userInfo={user} />
    </>
  );
}
