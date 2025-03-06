import { gql } from "@apollo/client";

const SUB_GET_MY_SUBMISSIONS = gql`
  subscription getExamSubmissions($uid: String!, $eid: uuid!) {
    exam_submissions(where: { exam_id: { _eq: $eid }, user_id: { _eq: $uid } }) {
      id
      status
      user_id
      exam_id
      answers
      markings
      created_at
      updated_at
    }
  }
`;

export default SUB_GET_MY_SUBMISSIONS;
