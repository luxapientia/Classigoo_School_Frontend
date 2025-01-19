"use client";

import React from "react";
import Loading from "@components/common/loading";

import { useQuery, useMutation } from "@apollo/client";
import { GET_CLASSROOM_ACCESS } from "@graphql/queries";
import { REMOVE_CLASSROOM_MEMBER } from "@graphql/mutations";

export default function LeaveClassRoomMain({ id, session }) {
  const [leaveClassroom] = useMutation(REMOVE_CLASSROOM_MEMBER);
  const { data: q_data } = useQuery(GET_CLASSROOM_ACCESS, {
    variables: { cid: id, uid: session.user.sub },
  });

  React.useEffect(() => {
    const leave = async () => {
      try {
        if (q_data?.classroom_access.length > 0) {
          if (!q_data?.classroom_access?.length) {
          } else {
            if (q_data?.classroom_access[0]?.status === "pending") {
              const left = leaveClassroom({
                variables: {
                  id: q_data?.classroom_access[0]?.id,
                },
              });

              if (left.leaveClassroom.status == "success") {
                window.location.href = `/classrooms?left=true`;
              } else {
                console.log("error leaving classroom");
                window.location.href = `/classrooms?left=false&error=${left.message}`;
              }
            } else {
              window.location.href = `/classrooms?left=false&error=You have already accepted the invitation`;
            }
          }
        }
      } catch (err) {
        window.location.href = `/classrooms?left=false&error=${err.message}`;
      }
    };
    leave();
  }, [q_data]);

  return (
    <>
      <Loading />
    </>
  );
}
