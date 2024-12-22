import { gql } from "@apollo/client";

const GET_PARENT = gql`
  query getParent($id: String!) {
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

export default GET_PARENT;
