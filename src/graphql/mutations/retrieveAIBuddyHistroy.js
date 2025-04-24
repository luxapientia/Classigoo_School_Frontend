import { gql } from "@apollo/client";

const RETRIEVE_AI_BUDDY_HISTORY = gql`
  mutation AIBuddyHisotry($page: Int!, $limit: Int!, $model: String!) {
    aiBuddyHistory(data: { page: $page, limit: $limit, model: $model }) {
      status
      message
      history
      pagination
    }
  }
`;

export default RETRIEVE_AI_BUDDY_HISTORY;
