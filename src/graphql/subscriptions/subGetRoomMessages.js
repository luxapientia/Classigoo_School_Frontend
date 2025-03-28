import { gql } from "@apollo/client";

const SUB_GET_ROOM_MESSAGES = gql`
  subscription getLatestMessage($rid: uuid!) {
    messages(where: { room_id: { _eq: $rid } }, limit: 10000, order_by: { created_at: desc }) {
      id
    }
  }
`;

export default SUB_GET_ROOM_MESSAGES;
