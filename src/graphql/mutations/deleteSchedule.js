import { gql } from "@apollo/client";

const DELETE_SCHEDULE = gql`
  mutation DeleteSchedule($eid: uuid!) {
    delete_schedules_by_pk(id: $eid) {
      id
    }
  }
`;

export default DELETE_SCHEDULE;