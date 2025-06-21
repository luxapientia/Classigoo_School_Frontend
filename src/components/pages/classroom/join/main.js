"use client";

import axios from "@lib/axios";
import React from "react";
import { redirect, useSearchParams } from "next/navigation";
import Loading from "@components/common/loading";

// import { useMutation } from "@apollo/client";
// import { JOIN_CLASSROOM } from "@graphql/mutations";

export default function JoinClassRoomMain({ id, userInfo }) {
  const searchParams = useSearchParams();

  if (!searchParams.get("code")) {
    redirect(`/classrooms`);
  }

  // const [joinClassroom] = useMutation(JOIN_CLASSROOM);

  React.useEffect(() => {
    const join = async () => {
      try {
        // await joinClassroom({
        //   variables: {
        //     id,
        //     code: searchParams.get("code"),
        //   },
        // });
        const { data: response } = await axios.post(`/v1/classroom/join`, {
          class_id: id,
          join_code: searchParams.get("code"),
        });

        if (response.status === "success") {
          window.location.href = `/classroom/${id}`;
        } else {
          window.location.href = `/classrooms`;
        }
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
