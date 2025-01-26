import { gql } from "@apollo/client";

const CREATE_CLASSROOM_POST = gql`
  mutation (
    $audience: jsonb!
    $classroom_id: String!
    $content: String!
    $files: jsonb!
    $status: String!
    $type: String!
    $published_at: timestamptz
  ) {
    createClassroomPost(
      data: {
        audience: $audience
        classroom_id: $classroom_id
        content: $content
        files: $files
        status: $status
        type: $type
        published_at: $published_at
      }
    ) {
      status
      message
    }
  }
`;

export default CREATE_CLASSROOM_POST;
