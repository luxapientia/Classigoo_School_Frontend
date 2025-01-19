import { gql } from "@apollo/client";

const CHANGE_CLASSROOM_USER_ROLE = gql`
  mutation changeClassroomUserRole($id: uuid!, $role: String!) {
    changeClassroomUserRole(data: { id: $id, role: $role }) {
      status
      message
    }
  }
`;

export default CHANGE_CLASSROOM_USER_ROLE;
