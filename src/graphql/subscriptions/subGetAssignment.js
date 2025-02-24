import { gql } from "@apollo/client";

const SUB_GET_ASSIGNMENT = gql`
  subscription subGetAssignment($id: uuid!) {
    assignments_by_pk(id: $id) {
      id
      title
      files
      status
      content
      deadline
      audience
      class_id
      creator_id
      created_at
      updated_at
      owner {
        id
        name
        email
        avatar
      }
      assignment_submissions {
        id
        files
        status
        created_at
        updated_at
        submitter {
          id
          name
          email
          avatar
        }
      }
    }
  }
`;

export default SUB_GET_ASSIGNMENT;
