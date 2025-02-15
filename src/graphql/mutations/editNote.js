import { gql } from "@apollo/client";

const EDIT_NOTE = gql`
  mutation editNote(
    $id: uuid!
    $title: String!
    $content: String!
    $status: bpchar!
    $classroom_ids: jsonb!
  ) {
    editNote(
      data: {
        id: $id
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

export default EDIT_NOTE;
