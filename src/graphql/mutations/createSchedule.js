import { gql } from "@apollo/client";

const CREATE_SCHEDULE = gql`
  mutation CreateSchedule(
    $title: String!
    $description: String!
    $cid: uuid!
    $sTime: timestamptz!
    $eTime: timestamptz!
  ) {
    insert_schedules_one(
      object: { title: $title, description: $description, class_id: $cid, start_time: $sTime, end_time: $eTime }
    ) {
      id
    }
  }
`;

export default CREATE_SCHEDULE;
