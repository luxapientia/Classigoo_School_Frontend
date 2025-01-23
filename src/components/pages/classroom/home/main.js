"use client";

import { useSubscription } from "@apollo/client";
import { SUB_GET_CLASSROOM } from "@graphql/subscriptions";
import ClassroomLayout from "../layout/layout";
import InviteMemberBlock from "../members/invite-block";
import ClassroomHomeEditor from "./editor";

export default function ClassroomHomeMain({ id, session }) {
  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_GET_CLASSROOM, {
    variables: { id },
  });

  let user;

  if (session && sub_data?.classrooms_by_pk) {
    user = sub_data?.classrooms_by_pk.classroom_relation.find((r) => r.user.id === session.user.sub);
  }

  return (
    <ClassroomLayout id={id} loading={sub_loading} classroom={sub_data?.classrooms_by_pk}>
      <div className="max-w-4xl mx-auto">
        <div className="flex">
          <div className="flex-initial">
            {/* <InviteMemberBlock id={id} code={sub_data?.classrooms_by_pk?.invitation_code} teacher={false} /> */}
          </div>
          <div className="flex-auto">
            <ClassroomHomeEditor user={user} />
          </div>
        </div>
        {/* <h1>Classroom Home Main</h1> */}
      </div>
    </ClassroomLayout>
  );
}
