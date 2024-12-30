import { gql } from "@apollo/client";

const CREATE_SUBSCRIPTION = gql`
  mutation createSubscription($id: String!, $plan: String!) {
    createSubscription(id: $id, plan: $plan) {
      status
      message
      url
    }
  }
`;

export default CREATE_SUBSCRIPTION;
