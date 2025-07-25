import { gql } from "@apollo/client";

const SUB_GET_CLASSROOM = gql`
  subscription GetClassroom($id: uuid!) {
    classrooms_by_pk(id: $id) {
      id
      name
      section
      subject
      room
      child_only
      invitation_code
      cover_img
      ownerDetails {
        name
        id
        avatar
      }
      classroom_relation {
        id
        role
        status
        user {
          id
          avatar
          name
          email
          is_plus
        }
      }
    }
  }
`;

export default SUB_GET_CLASSROOM;
