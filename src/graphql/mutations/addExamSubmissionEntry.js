import { gql } from "@apollo/client";

const ADD_EXAM_SUBMISSION_ENTRY = gql`
  mutation addSubmissionEntry($eid: uuid!, $status: String!) {
    insert_exam_submissions_one(object: { exam_id: $eid, status: $status }) {
      id
    }
  }
`;

export default ADD_EXAM_SUBMISSION_ENTRY;
