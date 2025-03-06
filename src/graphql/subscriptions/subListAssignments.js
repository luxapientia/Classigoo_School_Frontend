import { gql } from "@apollo/client";

const SUB_LIST_ASSIGNMENTS = gql`
  subscription subListAssignments($cid: uuid!) {
    assignments(where: { class_id: { _eq: $cid } }, order_by: { created_at: desc }) {
      id
      status
      title
      content
      deadline
      audience
      creator_id
      updated_at
      owner {
        name
        id
        avatar
        email
      }
    }
  }
`;

export default SUB_LIST_ASSIGNMENTS;
