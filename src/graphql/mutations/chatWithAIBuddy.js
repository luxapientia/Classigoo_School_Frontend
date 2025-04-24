import { gql } from "@apollo/client";

const CHAT_WITH_AI_BUDDY = gql`
  mutation AIBuddyChat($model: String!, $prompt: String!, $chat_id: String) {
    aiBuddyChat(data: { model: $model, prompt: $prompt, chat_id: $chat_id }) {
      status
      message
      limits
      content
      chat_id
    }
  }
`;

export default CHAT_WITH_AI_BUDDY;
