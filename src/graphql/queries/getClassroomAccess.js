import { gql } from "@apollo/client";

const GET_CLASSROOM_ACCESS = gql`
  query getClassroomAccess($cid: uuid!, $uid: String!) {
    classroom_access(
      where: { class_id: { _eq: $cid }, user_id: { _eq: $uid } }
    ) {
      id
      status
    }
  }
`;

export default GET_CLASSROOM_ACCESS;
