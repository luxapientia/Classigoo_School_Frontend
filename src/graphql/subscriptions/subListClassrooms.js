import { gql } from "@apollo/client";

const SUB_LIST_CLASSROOMS = gql`
  subscription ListClassrooms {
    classrooms {
      id
      name
      owner
      room
      section
      subject
      invitation_code
      cover_img
      ownerDetails {
        avatar
        name
      }
    }
  }
`;

export default SUB_LIST_CLASSROOMS;
