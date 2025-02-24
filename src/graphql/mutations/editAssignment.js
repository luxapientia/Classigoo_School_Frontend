import { gql } from "@apollo/client";

const EDIT_ASSIGNMENT = gql`
  mutation editAssignment(
    $id: uuid!
    $title: String!
    $content: String!
    $files: jsonb!
    $status: String!
    $aud: jsonb!
    $deadline: timestamptz!
  ) {
    update_assignments_by_pk(
      pk_columns: { id: $id }
      _set: {
        title: $title
        content: $content
        files: $files
        status: $status
        audience: $aud
        deadline: $deadline
      }
    ) {
      id
    }
  }
`;

export default EDIT_ASSIGNMENT;
