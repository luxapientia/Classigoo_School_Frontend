import { gql } from "@apollo/client";

const ADD_COMMENT = gql`
  mutation addComment($cid: String!, $pid: String!, $content: String!) {
    addClassroomPostComment(
      data: { class_id: $cid, post_id: $pid, content: $content }
    ) {
      status
      message
    }
  }
`;

export default ADD_COMMENT;
