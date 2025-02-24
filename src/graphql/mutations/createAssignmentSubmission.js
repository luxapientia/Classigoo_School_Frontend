import { gql } from "@apollo/client";

const CREATE_ASSIGNMENT_SUBMISSION = gql`
  mutation createFileSubmission($aid: uuid!, $files: jsonb!, $status: String!) {
    insert_assignment_submissions_one(
      object: { assignment_id: $aid, files: $files, status: $status }
    ) {
      id
    }
  }
`;

export default CREATE_ASSIGNMENT_SUBMISSION;
