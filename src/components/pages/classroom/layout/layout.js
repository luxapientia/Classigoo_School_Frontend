"use client";

import Loading from "@components/common/loading";
import ClassroomHeader from "./header";
import NotFoundPage from "@app/not-found";

export default function ClassroomLayout({ id, children, classroom, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );
  }
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
          />
          <section>{children}</section>
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}
