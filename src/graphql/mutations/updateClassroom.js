import { gql } from "@apollo/client";

const UPDATE_CLASSROOM = gql`
  mutation updateClassroom(
    $id: uuid!
    $name: String!
    $subject: String!
    $section: String!
    $room: String!
    $child_only: Boolean!
  ) {
    update_classrooms_by_pk(
      pk_columns: { id: $id }
      _set: { name: $name, subject: $subject, section: $section, room: $room, child_only: $child_only }
    ) {
      id
    }
  }
`;

export default UPDATE_CLASSROOM;
