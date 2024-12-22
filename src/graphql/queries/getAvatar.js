import { gql } from "@apollo/client";

const GET_AVATAR = gql`
  query getProfile($id: String!) {
    users_by_pk(id: $id) {
      avatar
    }
  }
`;

export default GET_AVATAR;
