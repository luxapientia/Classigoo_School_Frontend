import { gql } from "@apollo/client";

const GET_ROOM_MESSAGES = gql`
  query getMessage($rid: uuid!, $limit: Int!, $offset: Int!) {
    messages(where: { room_id: { _eq: $rid } }, limit: $limit, order_by: { created_at: desc }, offset: $offset) {
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

export default GET_ROOM_MESSAGES;
