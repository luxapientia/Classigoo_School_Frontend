import { gql } from "@apollo/client";

const RETRIEVE_SINGLE_AI_BUDDY_CHAT = gql`
  mutation AIChatGetSingle($id: String!, $model: String!) {
    aiBuddyChatSingle(data: { chat_id: $id, model: $model }) {
      status
      message
      limit
      chats
      not_found
    }
  }
`;

export default RETRIEVE_SINGLE_AI_BUDDY_CHAT;
