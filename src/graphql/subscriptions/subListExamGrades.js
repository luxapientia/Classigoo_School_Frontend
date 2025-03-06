import { gql } from "@apollo/client";

const SUB_LIST_EXAM_GRADES = gql`
  subscription listExamGrades($cid: uuid!) {
    exam_submissions(where: { status: { _eq: "published" }, exam: { class_id: { _eq: $cid } } }) {
      id
      exam {
        id
        title
        status
        duration
        questions
        created_at
        start_once
      }
      status
      user_id
      exam_id
      markings
      created_at
      updated_at
    }
  }
`;

export default SUB_LIST_EXAM_GRADES;
