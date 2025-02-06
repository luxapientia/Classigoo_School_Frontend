import { gql } from "@apollo/client";

const DELETE_CLASSROOM = gql`
  mutation deleteClassroom($cid: uuid!) {
    delete_classrooms_by_pk(id: $cid) {
      id
    }
  }
`;

export default DELETE_CLASSROOM;
