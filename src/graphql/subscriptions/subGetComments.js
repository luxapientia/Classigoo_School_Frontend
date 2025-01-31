import { gql } from "@apollo/client";

const SUB_GET_COMMENTS = gql`
  subscription fetchComments($pid: uuid!) {
    classroom_post_comments(where: { post: { id: { _eq: $pid } } }) {
      id
      user {
        id
        name
        email
        avatar
      }
      content
      created_at
    }
  }
`;

export default SUB_GET_COMMENTS;
