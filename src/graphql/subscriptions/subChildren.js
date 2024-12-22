import { gql } from "@apollo/client";

const SUB_CHILDREN = gql`
  subscription subToChildren($id: String!) {
    child_parent(where: { parent_id: { _eq: $id } }) {
      id
      status
      child {
        name
        is_plus
        avatar
        email
      }
    }
  }
`;

export default SUB_CHILDREN;
