"use client";

import React from "react";
import axios from "@lib/axios";
import Loading from "@components/common/loading";

// import { useQuery, useMutation } from "@apollo/client";
// import { GET_CLASSROOM_ACCESS } from "@graphql/queries";
// import { REMOVE_CLASSROOM_MEMBER } from "@graphql/mutations";

export default function LeaveClassRoomMain({ id, userInfo }) {
  // const [leaveClassroom] = useMutation(REMOVE_CLASSROOM_MEMBER);
  // const { data: q_data } = useQuery(GET_CLASSROOM_ACCESS, {
  //   variables: { cid: id, uid: session.user.sub },
  // });

  React.useEffect(() => {
    const getAccess = async () => {
      const { data: response } = await axios.get(`/v1/classroom/access/${id}/${userInfo._id}`);
      if (response.status === "success") {
        return response.data._id;
      } else {
        return null;
      }
    }

    const leaveClassroom = async (accessId) => {
      const { data: response } = await axios.post(`/v1/classroom/member/remove`, {
        relation_id: accessId,
      });
      if (response.status === "success") {
        window.location.href = `/classrooms?left=true`;
      } else {
        window.location.href = `/classrooms?left=false&error=${response.message}`;
      }
    }

    const leave = async () => {
      const accessId = await getAccess();
      if (accessId) {
        await leaveClassroom(accessId);
      }
    }

    leave();
  }, []);

  return (
    <>
      <Loading />
    </>
  );
}
