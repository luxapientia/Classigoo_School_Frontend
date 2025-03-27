import { gql } from "@apollo/client";

export const SUB_LIST_MESSAGE_RECEIPIENTS = gql`
  subscription MessageReceipents($cid: uuid!) {
    message_rooms(order_by: { updated_at: desc }, where: { classroom_id: { _eq: $cid } }) {
      id
      name
      type
      users {
        id
        user {
          id
          name
          email
          avatar
        }
      }
    }
  }
`;

export default SUB_LIST_MESSAGE_RECEIPIENTS;
