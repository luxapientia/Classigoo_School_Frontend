"use client";

import axios from "@lib/axios";
import React from "react";
import { redirect, useSearchParams } from "next/navigation";
import Loading from "@components/common/loading";

export default function JoinClassRoomMain({ id, userInfo }) {
  const searchParams = useSearchParams();

  if (!searchParams.get("code")) {
    redirect(`/classrooms`);
  }

  React.useEffect(() => {
    const join = async () => {
      try {
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

    const acceptInvitation = async () => {
      try {
        const { data: response } = await axios.post(`/v1/classroom/member/accept-invitation`, {
          class_id: id,
          student_id: searchParams.get("student"),
        });

        window.location.href = `/classrooms`
      } catch (err) {
        console.error(err);
      }
    };

    if (searchParams.get("student")) {
      acceptInvitation();
    } else {
      join();
    }
  }, []);

  return (
    <>
      <Loading />
    </>
  );
}
