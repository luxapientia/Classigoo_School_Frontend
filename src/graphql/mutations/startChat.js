import { gql } from "@apollo/client";

const START_CHAT = gql`
  mutation StartChat($uid: String!, $cid: uuid!) {
    initiateChat(data: { classroom_id: $cid, with_user: $uid }) {
      id
      status
      message
    }
  }
`;

export default START_CHAT;
