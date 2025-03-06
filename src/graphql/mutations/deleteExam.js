import { gql } from "@apollo/client";

const DELETE_EXAM = gql`
  mutation deleteExam($eid: uuid!) {
    delete_exams_by_pk(id: $eid) {
      id
    }
  }
`;

export default DELETE_EXAM;