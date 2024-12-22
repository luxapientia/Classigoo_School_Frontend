import { gql } from "@apollo/client";

const GET_CHILDREN = gql`
  query getChildren($id: String!) {
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

export default GET_CHILDREN;
