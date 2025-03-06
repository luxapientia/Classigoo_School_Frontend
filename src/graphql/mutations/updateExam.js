import { gql } from "@apollo/client";

const UPDATE_EXAM = gql`
  mutation updateExam(
    $title: String!
    $eid: uuid!
    $aud: jsonb!
    $content: String!
    $duration: Int!
    $start_once: timestamptz
    $status: String!
    $questions: jsonb!
  ) {
    update_exams_by_pk(
      pk_columns: { id: $eid }
      _set: {
        title: $title
        audience: $aud
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

export default UPDATE_EXAM;
