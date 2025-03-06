import { gql } from "@apollo/client";

const UPDATE_EXAM_SUBMISSION_MARKINGS = gql`
  mutation updateExamSubmissions($sid: uuid!, $markings: jsonb!, $status: String!) {
    update_exam_submissions_by_pk(pk_columns: { id: $sid }, _set: { markings: $markings, status: $status }) {
      id
    }
  }
`;

export default UPDATE_EXAM_SUBMISSION_MARKINGS;
