import { gql } from "@apollo/client";

const CREATE_CLASSROOM = gql`
  mutation createClassroom(
    $name: String!
    $section: String
    $subject: String
    $room: String
  ) {
    createClassroom(
      data: { name: $name, section: $section, subject: $subject, room: $room }
    ) {
      id
      message
      status
    }
  }
`;

export default CREATE_CLASSROOM;
