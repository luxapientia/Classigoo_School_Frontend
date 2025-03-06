import { gql } from "@apollo/client";

const LIST_EXAMS = gql`
  subscription listExams($cid: uuid!) {
    exams(where: { class_id: { _eq: $cid } }, order_by: { created_at: desc }) {
      id
      title
      status
      audience
      duration
      owner_id
      start_once
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

export default LIST_EXAMS;
