"use client";
import moment from "moment";
import React, { useEffect } from "react";
import { useSubscription } from "@apollo/client";
import { SUB_GET_CLASSROOM } from "@graphql/subscriptions";
import ClassroomLayout from "../layout/layout";
import InviteMemberBlock from "../members/invite-block";
import ClassroomHomeEditor from "./editor";

import { useMutation } from "@apollo/client";
import { CREATE_CLASSROOM_POST } from "@graphql/mutations";
import { Alert } from "@heroui/react";
import MemberSelector from "./member-selector";

export default function ClassroomHomeMain({ id, session }) {
  // states
  // -> data
  const [writting, setWritting] = React.useState(false);
  const [content, setContent] = React.useState("");
  const [pType, setPType] = React.useState("thread");
  const [audience, setAudience] = React.useState(["*"]);
  const [pubAt, setPubAt] = React.useState(null);
  const [files, setFiles] = React.useState([]);
  const [status, setStatus] = React.useState("published");
  const [openPicker, setOpenPicker] = React.useState(false);
  // -> status

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  // graphql
  // -> mutations
  const [createClassroomPost] = useMutation(CREATE_CLASSROOM_POST);

  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_GET_CLASSROOM, {
    variables: { id },
  });

  let user;

  if (session && sub_data?.classrooms_by_pk) {
    user = sub_data?.classrooms_by_pk.classroom_relation.find((r) => r.user.id === session.user.sub);
  }

  // hooks
  React.useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [error]);

  React.useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    }
  }, [success]);

  // actions
  const handleCreatePost = async () => {
    setLoading(true);

    try {
      const create = await createClassroomPost({
        variables: {
          audience,
          classroom_id: id,
          content,
          files: files,
          status: status,
          type: pType,
          // utc time pub at or now
          published_at: pubAt ? moment(pubAt).format().toString() : moment().format().toString(),
        },
      });

      if (create.data.createClassroomPost.status === "success") {
        setSuccess("Post created successfully");
        setContent("");
        setFiles([]);
        setStatus("published");
        setPType("thread");
        setPubAt(null);
        setWritting(false);
        setLoading(false);
      }

      if (create.data.createClassroomPost.status === "error") {
        setLoading(false);
        setError(create.data.createClassroomPost.message);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <ClassroomLayout id={id} loading={sub_loading} classroom={sub_data?.classrooms_by_pk}>
      {openPicker && (
        <MemberSelector
          my_id={session.user.sub}
          members={sub_data?.classrooms_by_pk?.classroom_relation}
          audience={audience}
          setAudience={setAudience}
          setOpenPicker={setOpenPicker}
        />
      )}
      <div className="max-w-4xl mx-auto">
        <div className="flex">
          <div className="flex-initial">
            {/* <InviteMemberBlock id={id} code={sub_data?.classrooms_by_pk?.invitation_code} teacher={false} /> */}
          </div>
          <div className="flex-auto">
            {error && (
              <Alert
                hideIconWrapper
                color="danger"
                title="Something went wrong"
                description={error}
                variant="bordered"
                isClosable={true}
                classNames={{
                  base: "my-5",
                }}
              />
            )}

            {success && (
              <Alert
                hideIconWrapper
                color="success"
                title={success}
                variant="bordered"
                isClosable={true}
                classNames={{
                  base: "my-5",
                }}
              />
            )}

            <ClassroomHomeEditor
              user={user}
              loading={loading}
              content={content}
              setContent={setContent}
              type={pType}
              setType={setPType}
              audience={audience}
              pubAt={pubAt}
              setPubAt={setPubAt}
              files={files}
              setFiles={setFiles}
              status={status}
              setStatus={setStatus}
              setOpenPicker={setOpenPicker}
              writting={writting}
              setWritting={setWritting}
              handleCreatePost={handleCreatePost}
            />
          </div>
        </div>
        {/* <h1>Classroom Home Main</h1> */}
      </div>
    </ClassroomLayout>
  );
}
