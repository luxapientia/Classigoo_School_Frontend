import { gql } from "@apollo/client";

const DISABLE_CLASSROOM_INVITATION = gql`
  mutation disableJoin($cid: String!) {
    disableClassroomInvitation(data: { classroom: $cid }) {
      status
      message
    }
  }
`;

export default DISABLE_CLASSROOM_INVITATION;
