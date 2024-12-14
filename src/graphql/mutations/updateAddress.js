import { gql } from "@apollo/client";

const UPDATE_ADDRESS = gql`
  mutation updateAddress($id: String, $address: jsonb) {
    update_users(where: { id: { _eq: $id } }, _set: { address: $address }) {
      affected_rows
    }
  }
`;

export default UPDATE_ADDRESS;
