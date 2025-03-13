"use client";
import axios from "axios";
import moment from "moment";
import { Icon } from "@iconify/react";
import React, { use, useEffect } from "react";
import ClassroomHomeEditor from "./editor";
import { Alert, Button } from "@heroui/react";
import ClassroomLayout from "../layout/layout";
import MemberSelector from "./member-selector";
import { useSubscription } from "@apollo/client";
import { FileUploader } from "react-drag-drop-files";
import InviteMemberBlock from "../members/invite-block";

// graphql imports
import { useMutation } from "@apollo/client";
import { CREATE_CLASSROOM_POST } from "@graphql/mutations";
import { SUB_GET_POSTS, SUB_GET_CLASSROOM } from "@graphql/subscriptions";
import ClassroomPost from "./posts";

export default function ClassroomHomeMain({ id, session }) {
  const imageTypes = ["JPEG", "JPG", "PNG", "GIF"];
  // states
  // -> data
  const [writting, setWritting] = React.useState(false);
  const [content, setContent] = React.useState("");
  const [pType, setPType] = React.useState("thread");
  const [audience, setAudience] = React.useState(["*"]);
  const [pubAt, setPubAt] = React.useState(null);
  const [files, setFiles] = React.useState([]);
  const [tempFile, setTempFile] = React.useState(null);
  const [tempFilePreview, setTempFilePreview] = React.useState(null);
  const [status, setStatus] = React.useState("published");
  const [openPicker, setOpenPicker] = React.useState(false);
  const [filePicker, setFilePicker] = React.useState("");
  const [fileError, setFileError] = React.useState("");
  const [fileSuccess, setFileSuccess] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);
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

  const {
    data: sub_posts,
    loading: sub_posts_loading,
    error: sub_posts_error,
  } = useSubscription(SUB_GET_POSTS, {
    variables: { cid: id },
  });

  let user;

  if (session && sub_data?.classrooms_by_pk) {
    user = sub_data?.classrooms_by_pk.classroom_relation.find((r) => r.user.id === session.user.sub);
  }

  // hooks
  React.useEffect(() => {
    if (error) {
      const sT = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(sT);
    }
  }, [error]);

  React.useEffect(() => {
    if (success) {
      const sT = setTimeout(() => {
        setSuccess("");
      }, 5000);

      return () => clearTimeout(sT);
    }
  }, [success]);

  React.useEffect(() => {
    if (fileError) {
      const sT = setTimeout(() => {
        setFileError("");
      }, 5000);

      return () => clearTimeout(sT);
    }
  }, [fileError]);

  React.useEffect(() => {
    if (fileSuccess) {
      const sT = setTimeout(() => {
        setFileSuccess("");
      }, 5000);

      return () => clearTimeout(sT);
    }
  }, [fileSuccess]);

  // actions
  // handle file change
  const handleFileChange = async (file) => {
    setTempFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

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

  // file upload logic
  const handleFileUpload = async () => {
    setLoading(true);
    setSuccess("");
    setFileError("");
    try {
      if (filePicker === "image") {
        if (!tempFile) {
          setFileError("Please select an image to upload.");
          return;
        }

        let formData = new FormData();
        formData.append("image", tempFile);

        // post form data image
        const response = await axios.post("/api/proxy/upload/posts/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        let fileSize;

        if (tempFile.size < 1024) {
          fileSize = `${tempFile.size} bytes`;
        } else if (tempFile.size >= 1024 && tempFile.size < 1048576) {
          fileSize = `${(tempFile.size / 1024).toFixed(2)} KB`;
        } else {
          fileSize = `${(tempFile.size / 1048576).toFixed(2)} MB`;
        }

        if (response.data.status === "success") {
          setFileSuccess("Image uploaded successfully.");
          setFiles((prev) =>
            prev.concat({
              type: "image",
              name: response.data.data.name,
              mimetype: response.data.data.type,
              location: response.data.data.location,
              size: fileSize,
            })
          );

          setTempFile(null);
          setTempFilePreview(null);
          setFilePicker(false);
        } else {
          setFileError(response.data.message);
        }
        setLoading(false);
      } else if (filePicker === "file") {
        if (!tempFile) {
          setFileError("Please select a file to upload.");
          return;
        }

        let formData = new FormData();
        formData.append("file", tempFile);

        // post form data image
        const response = await axios.post("/api/proxy/upload/posts/file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        let fileSize;

        if (tempFile.size < 1024) {
          fileSize = `${tempFile.size} bytes`;
        } else if (tempFile.size >= 1024 && tempFile.size < 1048576) {
          fileSize = `${(tempFile.size / 1024).toFixed(2)} KB`;
        } else {
          fileSize = `${(tempFile.size / 1048576).toFixed(2)} MB`;
        }

        if (response.data.status === "success") {
          setFileSuccess("File uploaded successfully.");
          setFiles((prev) =>
            prev.concat({
              type: "file",
              name: response.data.data.name,
              mimetype: response.data.data.type,
              location: response.data.data.location,
              size: fileSize,
            })
          );

          setTempFile(null);
          setTempFilePreview(null);
          setFilePicker(false);
        } else {
          setFileError(response.data.message);
        }
        setLoading(false);
      } else {
        setFileError("Invalid file type.");

        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setFileError(err.message);
    }
  };

  // handle delete file
  const handleDeleteFile = async (locations) => {
    // remove file from the server
    setDeleting(true);
    try {
      const response = await axios.post("/api/proxy/upload/posts/delete", {
        files: locations,
      });

      if (response.data.status === "success") {
        // remove the specific files from the state by the way locations are array of file locations
        setFiles((prev) => prev.filter((f) => !locations.includes(f.location)));
      }

      if (response.data.status === "error") {
        setFileError(response.data.message);
      } else {
        setFileSuccess("File deleted successfully.");
      }
    } catch (err) {
      // console.log(err);
      setFileError(err.message);
    }
    setDeleting(false);
  };

  // can user post
  const canPost = !sub_data?.classrooms_by_pk?.child_only || user?.role === "owner" || user?.role === "teacher";

  return (
    <ClassroomLayout id={id} loading={sub_loading || sub_posts_loading} classroom={sub_data?.classrooms_by_pk}>
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
        {/* <div className="flex">
          <div className="flex-initial">
            <InviteMemberBlock id={id} code={sub_data?.classrooms_by_pk?.invitation_code} teacher={false} />
          </div> */}
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
          {fileError && (
            <Alert
              hideIconWrapper
              color="danger"
              title="Something went wrong"
              description={fileError}
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
          {fileSuccess != "" && (
            <Alert
              hideIconWrapper
              color="success"
              title={fileSuccess}
              variant="bordered"
              isClosable={true}
              classNames={{
                base: "my-5",
              }}
            />
          )}
          {/* check if classroom child only and if child only then if am i a owner or teacher */}
          {canPost ? (
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
              deleting={deleting}
              writting={writting}
              setWritting={setWritting}
              setFilePicker={setFilePicker}
              handleCreatePost={handleCreatePost}
              handleRemoveFile={handleDeleteFile}
            />
          ) : (
            ""
          )}
          <ClassroomPost
            posts={sub_posts?.classroom_posts}
            user={user}
            canPost={canPost}
            setSuccess={setSuccess}
            setError={setError}
            handleDeleteFile={handleDeleteFile}
            classroom_id={id}
          />
        </div>
        {/* </div> */}
        {/* <h1>Classroom Home Main</h1> */}
      </div>

      {filePicker && (
        <div className="bg-black/5 fixed inset-0 z-50 flex items-center justify-center top-0 left-0 right-0 bottom-0 backdrop-blur-[5px]">
          <div className="bg-white dark:bg-black p-5 rounded-xl max-w-[90%] w-[512px]">
            {tempFile ? (
              filePicker === "file" ? (
                <div className="">
                  <div className="flex justify-center content-center">
                    <Icon icon="akar-icons:file" className="h-full w-36 text-default-400 py-5" />
                  </div>
                  <p className="text-center text-xs text-gray-500">
                    {tempFile.name} - {tempFile.size / 1000000}MB
                  </p>
                </div>
              ) : (
                <div className="flex justify-center content-center">
                  <img src={tempFilePreview} alt="Profile" className="h-48 w-auto object-cover rounded-lg" />
                </div>
              )
            ) : (
              <FileUploader
                {...(filePicker === "image" && { types: imageTypes })}
                handleChange={handleFileChange}
                // free users 10mb pro users 50mb
                maxSize={user?.user?.is_plus ? 50 : 10}
                overRide
              >
                <div className="border-2 border-dotted border-default-200 rounded-lg flex items-center justify-center px-4 py-8 mb-2">
                  <Icon icon="akar-icons:upload" className="h-8 w-8 text-default-400" />
                  <p className="text-sm text-default-400">Drag and drop your file here</p>
                </div>
                {filePicker === "image" && (
                  <p className="text-xs text-default-400">
                    <span className="text-danger-500">*</span>
                    Allowed File types: {imageTypes.join(", ")}
                  </p>
                )}
                <p className="text-xs text-default-400">
                  <span className="text-danger-500">*</span>
                  Max file size: {user?.user?.is_plus ? 50 : 10}MB
                </p>
                {!user?.user?.is_plus && (
                  <p className="text-xs text-default-400">
                    <span className="text-danger-500">*</span>
                    Upgrade to plus to upload bigger files.
                  </p>
                )}
              </FileUploader>
            )}

            {fileError && <Alert className="my-2" color="danger" title="Error" description={fileError} />}

            <div className="flex justify-end w-full">
              <Button
                className="mt-4 bg-danger text-background rounded-sm mr-2"
                size="sm"
                variant="text"
                onPress={() => {
                  setTempFile(null);
                  setFilePicker(false);
                }}
                isDisabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="mt-4 bg-default-foreground text-background rounded-sm"
                size="sm"
                variant="text"
                onPress={handleFileUpload}
                isDisabled={!tempFile}
                isLoading={loading}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </ClassroomLayout>
  );
}
