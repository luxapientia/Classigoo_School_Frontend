import { gql } from "@apollo/client";

const SUB_GET_NOTE = gql`
  subscription getNote($id: uuid!) {
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

export default SUB_GET_NOTE;
