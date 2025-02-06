import { gql } from "@apollo/client";

const ENABLE_CLASSROOM_INVITATION = gql`
  mutation enableInvitation($cid: String!) {
    enableClassroomInvitation(data: { classroom: $cid }) {
      status
      message
    }
  }
`;

export default ENABLE_CLASSROOM_INVITATION;
