import { gql } from "@apollo/client";

const GET_NOTE = gql`
  query getNote($id: uuid!) {
    notes_by_pk(id: $id) {
      id
      status
      title
      content
      updated_at
      owner_data {
        id
        name
        avatar
        email
      }
      classroom_notes {
        classroom {
          id
          name
        }
      }
    }
  }
`;

export default GET_NOTE;
