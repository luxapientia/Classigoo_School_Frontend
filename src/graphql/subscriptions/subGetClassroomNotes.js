import { gql } from "@apollo/client";

const SUB_GET_CLASSROOM_NOTES = gql`
  subscription getNotes($cid: uuid!) {
    notes(
      where: {
        classroom_notes: { class_id: { _eq: $cid } }
        status: { _eq: "published" }
      }
    ) {
      id
      status
      title
      updated_at
      owner_data {
        name
      }
    }
  }
`;

export default SUB_GET_CLASSROOM_NOTES;
