import { gql } from "@apollo/client";

const GET_COMMENTS = gql`
  query fetchComments(
    $pid: uuid!
    $limit: Int!
    $offset: Int
    $order: order_by!
  ) {
    classroom_post_comments(
      limit: $limit
      offset: $offset
      order_by: { created_at: $order }
      where: { post: { id: { _eq: $pid } } }
    ) {
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

export default GET_COMMENTS;
