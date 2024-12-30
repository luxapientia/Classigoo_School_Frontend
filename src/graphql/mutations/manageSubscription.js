import { gql } from "@apollo/client";

const MANAGE_SUBSCRIPTION = gql`
  mutation manageSubscription($id: String!) {
    manageSubscription(id: $id) {
      status
      message
      url
    }
  }
`;

export default MANAGE_SUBSCRIPTION;