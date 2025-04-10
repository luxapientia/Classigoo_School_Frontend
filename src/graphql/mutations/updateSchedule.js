import { gql } from "@apollo/client";

const UPDATE_SCHEDULE = gql`
  mutation UpdateSchedule(
    $eid: uuid!
    $title: String!
    $description: String!
    $sTime: timestamptz!
    $eTime: timestamptz!
  ) {
    update_schedules_by_pk(
      pk_columns: { id: $eid }
      _set: { title: $title, description: $description, end_time: $eTime, start_time: $sTime }
    ) {
      id
    }
  }
`;

export default UPDATE_SCHEDULE;
