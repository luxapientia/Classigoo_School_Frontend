import { gql } from "@apollo/client";

const ACCEPT_CHILD_CLAIM = gql`
  mutation acceptChildClaim($id: String!, $accept: Boolean!) {
    acceptChildInvite(accept: $accept, id: $id) {
      status
      message
    }
  }
`;

export default ACCEPT_CHILD_CLAIM;
