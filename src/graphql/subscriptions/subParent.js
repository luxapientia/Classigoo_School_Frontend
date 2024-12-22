import { gql } from "@apollo/client";

const SUB_PARENT = gql`
  subscription subToParent($id: String!) {
    child_parent(where: { child_id: { _eq: $id } }) {
      id
      status
      parent {
        name
        is_plus
        avatar
        email
      }
    }
  }
`;

export default SUB_PARENT;
