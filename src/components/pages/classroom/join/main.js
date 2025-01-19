"use client";

import React from "react";
import { redirect, useSearchParams } from "next/navigation";
import Loading from "@components/common/loading";

import { useMutation } from "@apollo/client";
import { JOIN_CLASSROOM } from "@graphql/mutations";

export default function JoinClassRoomMain({ id, session }) {
  const searchParams = useSearchParams();

  if (!searchParams.get("code")) {
    redirect(`/classrooms`);
  }

  const [joinClassroom] = useMutation(JOIN_CLASSROOM);

  React.useEffect(() => {
    const join = async () => {
      try {
        await joinClassroom({
          variables: {
            id,
            code: searchParams.get("code"),
          },
        });

        window.location.href = `/classroom/${id}`;
      } catch (err) {
        console.error(err);
        window.location.href = `/classrooms`;
      }
    };
    join();
  }, []);

  return (
    <>
      <Loading />
    </>
  );
}
