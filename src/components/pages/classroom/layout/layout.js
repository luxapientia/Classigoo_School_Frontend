"use client";

// import { useUser } from "@auth0/nextjs-auth0";
import Loading from "@components/common/loading";
import ClassroomHeader from "./header";
import NotFoundPage from "@app/not-found";
import { useAuth } from "@contexts/AuthContext";

export default function ClassroomLayout({ id, children, classroom, loading }) {
  const { user } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );
  }

  // get current user role
  const currentUser = classroom?.classroom_relation.find((cr) => cr.user._id === user._id);

  return (
    <>
      {classroom ? (
        <>
          <ClassroomHeader
            id={id}
            img={classroom.cover_img}
            name={classroom.name}
            subject={classroom.subject}
            section={classroom.section}
            room={classroom.room}
            owner={classroom.ownerDetails}
            currentUser={currentUser}
          />
          <section>{children}</section>
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}
