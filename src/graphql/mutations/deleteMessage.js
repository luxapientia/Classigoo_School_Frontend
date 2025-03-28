import { gql } from "@apollo/client";

const DELETE_MESSAGE = gql`
  mutation deleteMessage($mid: uuid!) {
    delete_messages_by_pk(id: $mid) {
      id
    }
  }
`;

export default DELETE_MESSAGE;
