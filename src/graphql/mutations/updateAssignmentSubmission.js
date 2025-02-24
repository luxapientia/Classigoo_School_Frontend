import { gql } from "@apollo/client";

const UPDATE_ASSIGNMENT_SUBMISSION = gql`
  mutation updateFileSubmission($id: uuid!, $files: jsonb!, $status: String!) {
    update_assignment_submissions_by_pk(
      pk_columns: { id: $id }
      _set: { status: $status, files: $files }
    ) {
      id
    }
  }
`;

export default UPDATE_ASSIGNMENT_SUBMISSION;
