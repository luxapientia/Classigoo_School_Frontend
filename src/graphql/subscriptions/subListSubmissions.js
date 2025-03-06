import { gql } from "@apollo/client";

const SUB_LIST_SUBMISSIONS = gql`
  subscription listExamSubmissions($eid: uuid!) {
    exam_submissions(where: { exam_id: { _eq: $eid } }) {
      id
      status
      user_id
      exam_id
      answers
      markings
      created_at
      updated_at
      user {
        id
        name
        email
        avatar
      }
    }
  }
`;

export default SUB_LIST_SUBMISSIONS;
