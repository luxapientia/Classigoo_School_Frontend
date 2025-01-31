import { gql } from "@apollo/client";

const SUB_GET_POSTS = gql`
  subscription getPosts($cid: uuid!) {
    classroom_posts(
      where: { classroom_id: { _eq: $cid } }
      order_by: { created_at: desc }
    ) {
      id
      type
      files
      status
      content
      audience
      created_at
      user {
        id
        name
        avatar
      }
      comments(limit: 1, order_by: { created_at: desc }) {
        id
        user {
          id
          name
          avatar
          email
        }
        content
        created_at
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export default SUB_GET_POSTS;
