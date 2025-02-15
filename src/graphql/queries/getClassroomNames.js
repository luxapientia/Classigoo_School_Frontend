import { gql } from "@apollo/client";

const GET_CLASSROOM_NAMES = gql`
  query userClassroomNames($uid: String!) {
    classroom_access(
      where: {
        user_id: { _eq: $uid }
        status: { _eq: "accepted" }
        role: { _neq: "student" }
      }
    ) {
      id
      classroom {
        id
        name
      }
    }
  }
`;

export default GET_CLASSROOM_NAMES;
