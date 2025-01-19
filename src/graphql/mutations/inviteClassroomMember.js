import { gql } from "@apollo/client";

const INVITE_CLASSROOM_MEMBER = gql`
  mutation inviteClassroomMember($cid: uuid!, $email: String!, $role: String!) {
    inviteClassroomMember(
      data: { class_id: $cid, email: $email, role: $role }
    ) {
      status
      message
    }
  }
`;

export default INVITE_CLASSROOM_MEMBER;
