import { gql } from "@apollo/client";

const DELETE_CHILD_CLAIM = gql`
  mutation deleteChildClaim($id: String!) {
    removeChildInvite(id: $id) {
      status
      message
    }
  }
`;

export default DELETE_CHILD_CLAIM;
