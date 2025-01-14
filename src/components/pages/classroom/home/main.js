"use client";

import { useSubscription } from "@apollo/client";
import { SUB_GET_CLASSROOM } from "@graphql/subscriptions";
import ClassroomLayout from "../layout/layout";

export default function ClassroomHomeMain({ id }) {
  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_GET_CLASSROOM, {
    variables: { id },
  });

  return (
    <ClassroomLayout
      id={id}
      loading={sub_loading}
      classroom={sub_data?.classrooms_by_pk}
    >
      <div>
        <h1>Classroom Home Main</h1>
      </div>
    </ClassroomLayout>
  );
}
