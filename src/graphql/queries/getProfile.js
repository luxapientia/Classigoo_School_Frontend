import { gql } from "@apollo/client";

const GET_PROFILE = gql`
  query getProfile($id: String!) {
    users_by_pk(id: $id) {
      id
      name
      email
      birthday
      avatar
      is_plus
      phone
      institution
      address
      bio
      created_at
      updated_at
    }
  }
`;

export default GET_PROFILE;
