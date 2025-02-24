import { gql } from "@apollo/client";

const DELETE_ASSIGNMENT = gql`
  mutation deleteAssignment($id: uuid!) {
    delete_assignments_by_pk(id: $id) {
      id
    }
  }
`;

export default DELETE_ASSIGNMENT;
