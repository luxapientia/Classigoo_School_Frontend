import { gql } from "@apollo/client";

const REMOVE_CLASSROOM_MEMBER = gql`
  mutation removeClassRoomMember($id: uuid!) {
    removeClassroomMember(data: { relation_id: $id }) {
      status
      message
    }
  }
`;

export default REMOVE_CLASSROOM_MEMBER;
