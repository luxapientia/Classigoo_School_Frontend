import { gql } from "@apollo/client";

const SUB_GET_ROOM_LATEST_MESSAGE = gql`
  subscription getLatestMessage($rid: uuid!) {
    messages(where: { room_id: { _eq: $rid } }, limit: 1, order_by: { created_at: desc }) {
      id
      user {
        id
        name
        avatar
      }
      content
      created_at
      updated_at
    }
  }
`;

export default SUB_GET_ROOM_LATEST_MESSAGE;
