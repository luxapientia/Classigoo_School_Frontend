import { gql } from "@apollo/client";

const SUB_LIST_SCHEDULES = gql`
  subscription GetAllSchedules($cid: uuid!) {
    schedules(where: { class_id: { _eq: $cid } }, order_by: { start_time: desc }) {
      id
      title
      description
      start_time
      end_time
      created_at
      updated_at
      owner {
        id
        name
        email
        avatar
      }
    }
  }
`;

export default SUB_LIST_SCHEDULES;
