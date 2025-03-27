import { gql } from "@apollo/client";

const SEND_MESSAGE = gql`
  mutation sendMessage($cid: uuid!, $rid: uuid!, $msg: jsonb!) {
    sendMessage(data: { class_id: $cid, message: $msg, room_id: $rid }) {
      status
      message
    }
  }
`;

export default SEND_MESSAGE;
