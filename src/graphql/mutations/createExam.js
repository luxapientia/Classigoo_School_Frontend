import { gql } from "@apollo/client";

const CREATE_EXAM = gql`
  mutation createExam(
    $title: String!
    $aud: jsonb!
    $cid: uuid!
    $content: String!
    $duration: Int!
    $start_once: timestamptz
    $status: String!
    $questions: jsonb!
  ) {
    insert_exams_one(
      object: {
        title: $title
        audience: $aud
        class_id: $cid
        content: $content
        duration: $duration
        start_once: $start_once
        status: $status
        questions: $questions
      }
    ) {
      id
    }
  }
`;

export default CREATE_EXAM;
