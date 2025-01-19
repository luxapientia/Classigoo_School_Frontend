import { gql } from "@apollo/client";

export const JOIN_CLASSROOM = gql`
  mutation joinClassroom($code: String!) {
    joinClassroom(data: { join_code: $code }) {
      id
      message
      status
    }
  }
`;

export default JOIN_CLASSROOM;
