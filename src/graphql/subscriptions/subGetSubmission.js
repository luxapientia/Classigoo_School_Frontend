import { gql } from "@apollo/client";

const SUB_GET_SUBMISSION = gql`
  subscription getExamSubmission($sid: uuid!) {
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

export default SUB_GET_SUBMISSION;
