import { gql } from "@apollo/client";

const RETRIEVE_AI_CHAT_SEARCH = gql`
  mutation AIChatSearch($model: String!, $query: String!) {
    aiBuddySearch(data: { model: $model, query: $query }) {
      status
      message
      data
    }
  }
`;

export default RETRIEVE_AI_CHAT_SEARCH;
