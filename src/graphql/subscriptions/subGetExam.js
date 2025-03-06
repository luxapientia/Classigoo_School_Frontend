import { gql } from "@apollo/client";

const GET_EXAM = gql`
  subscription getExam($id: uuid!) {
    exams_by_pk(id: $id) {
      id
      title
      status
      content
      audience
      duration
      owner_id
      questions
      start_once
      created_at
      updated_at
      owner {
        id
        name
        email
        avatar
      }
    }
  }
`;

export default GET_EXAM;
