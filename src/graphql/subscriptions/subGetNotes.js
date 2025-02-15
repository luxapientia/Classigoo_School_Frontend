import { gql } from "@apollo/client";

const SUB_GET_NOTES = gql`
  subscription getNotes($uid: String!) {
    notes(where: { owner_id: { _eq: $uid } }) {
      id
      status
      title
      updated_at
    }
  }
`;

export default SUB_GET_NOTES;
