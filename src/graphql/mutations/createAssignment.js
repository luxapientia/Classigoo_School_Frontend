import { gql } from "@apollo/client";

const CREATE_ASSIGNMENT = gql`
  mutation createAssignment(
    $title: String!
    $content: String
    $cid: uuid!
    $files: jsonb!
    $status: String!
    $aud: jsonb!
    $deadline: timestamptz!
  ) {
    insert_assignments(
      objects: {
        title: $title
        content: $content
        class_id: $cid
        files: $files
        status: $status
        audience: $aud
        deadline: $deadline
      }
    ) {
      returning {
        id
      }
    }
  }
`;

export default CREATE_ASSIGNMENT;
