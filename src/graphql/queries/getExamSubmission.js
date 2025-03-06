import { gql } from "@apollo/client";

const GET_EXAM_SUBMISSION = gql`
  query getExamSubmission($sid: uuid!) {
    exam_submissions_by_pk(id: $sid) {
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

export default GET_EXAM_SUBMISSION;
