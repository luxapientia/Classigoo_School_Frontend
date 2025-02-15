import { gql } from "@apollo/client";

const CREATE_NOTE = gql`
  mutation createNote(
    $title: String!
    $content: String!
    $status: bpchar!
    $classroom_ids: jsonb!
  ) {
    createNote(
      data: {
        title: $title
        content: $content
        status: $status
        classroom_ids: $classroom_ids
      }
    ) {
      id
      status
      message
    }
  }
`;

export default CREATE_NOTE;
