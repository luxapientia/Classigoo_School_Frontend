import { gql } from "@apollo/client";

const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $id: String
    $name: name!
    $bio: String!
    $birthday: date
    $avatar: String!
    $institution: name!
    $phone: String!
  ) {
    update_users(
      where: { id: { _eq: $id } }
      _set: { name: $name, avatar: $avatar, bio: $bio, birthday: $birthday, institution: $institution, phone: $phone }
    ) {
      affected_rows
    }
  }
`;

export default UPDATE_PROFILE;
