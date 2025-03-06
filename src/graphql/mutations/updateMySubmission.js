import { gql } from "@apollo/client";

const UPDATE_MY_SUBMISSION = gql`
  mutation updateExamSubmissions($sid: uuid!, $answers: jsonb!, $status: String!) {
    update_exam_submissions_by_pk(pk_columns: { id: $sid }, _set: { answers: $answers, status: $status }) {
      id
    }
  }
`;

export default UPDATE_MY_SUBMISSION;
