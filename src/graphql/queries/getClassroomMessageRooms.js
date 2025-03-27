import { gql } from "@apollo/client";

const GET_CLASSROOM_MESSAGE_ROOMS = gql`
  query MessageReceipents($cid: uuid!) {
    message_rooms(order_by: { active_at: asc }, where: { classroom_id: { _eq: $cid } }) {
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

export default GET_CLASSROOM_MESSAGE_ROOMS;
