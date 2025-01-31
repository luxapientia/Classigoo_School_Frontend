import { gql } from "@apollo/client";

const DELETE_COMMENT = gql`
  mutation deleteComment($cid: uuid!) {
    delete_classroom_post_comments_by_pk(id: $cid) {
      id
    }
  }
`;

export default DELETE_COMMENT;
