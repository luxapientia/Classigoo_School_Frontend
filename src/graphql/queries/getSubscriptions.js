import { gql } from "@apollo/client";

const GET_SUBSCRIPTIONS = gql`
  query listSubscriptions($id: String!) {
    users_by_pk(id: $id) {
      id
      email
      name
      avatar
      is_plus
    }
    child_count: child_parent_aggregate(
      where: { parent_id: { _eq: $id }, status: { _eq: "accepted" } }
    ) {
      aggregate {
        count
      }
    }
    parent_count: child_parent_aggregate(
      where: { child_id: { _eq: $id }, status: { _eq: "accepted" } }
    ) {
      aggregate {
        count
      }
    }
    child_parent(
      where: { parent_id: { _eq: $id }, status: { _eq: "accepted" } }
    ) {
      child {
        id
        email
        name
        avatar
        is_plus
      }
    }
  }
`;

export default GET_SUBSCRIPTIONS;
