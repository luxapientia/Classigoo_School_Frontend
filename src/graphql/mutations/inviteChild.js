import { gql } from "@apollo/client";

const INVITE_CHILD = gql`
  mutation inviteChild($email: String!) {
    inviteChild(email: $email) {
      status
      message
    }
  }
`;

export default INVITE_CHILD;
