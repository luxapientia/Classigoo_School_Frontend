import { gql } from "@apollo/client";

const GET_CLASSROOM = gql`
  query GetClassroom($id: uuid!) {
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

export default GET_CLASSROOM;
