import { gql } from "@apollo/client";

const DELETE_POST = gql`
  mutation deletePost($id: uuid!) {
    delete_classroom_posts_by_pk(id: $id) {
      id
    }
  }
`;

export default DELETE_POST;
