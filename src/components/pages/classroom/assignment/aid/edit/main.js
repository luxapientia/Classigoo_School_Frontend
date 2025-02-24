"use client";
import axios from "axios";
import React from "react";
import moment from "moment";
import { Icon } from "@iconify/react";
import { redirect } from "next/navigation";
import MemberSelector from "./member-selector";
import Loading from "@components/common/loading";
import TinyEditor from "@components/common/editor";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Alert,
  DatePicker,
} from "@heroui/react";

import {
  CalendarDateTime,
  parseDateTime,
  ZonedDateTime,
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";

import { EDIT_ASSIGNMENT } from "@graphql/mutations";
import { useMutation, useSubscription } from "@apollo/client";
import { SUB_GET_ASSIGNMENT, SUB_GET_CLASSROOM } from "@graphql/subscriptions";

import { FileUploader } from "react-drag-drop-files";
import NotFoundPage from "@app/not-found";

export default function AssignmentEditMainComponent({ cid, aid, user }) {
  const imageTypes = ["JPEG", "JPG", "PNG", "GIF"];

  const editorRef = React.useRef(null);
  const [title, setTitle] = React.useState("");
  const [files, setFiles] = React.useState([]);
  const [content, setContent] = React.useState("");
  const [deadline, setDeadline] = React.useState();

  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const [tempFile, setTempFile] = React.useState(null);
  const [tempFilePreview, setTempFilePreview] = React.useState(null);
  const [audience, setAudience] = React.useState(["*"]);
  const [filePicker, setFilePicker] = React.useState("");
  const [fileError, setFileError] = React.useState("");
  const [fileSuccess, setFileSuccess] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);
  const [openPicker, setOpenPicker] = React.useState(false);

  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_GET_CLASSROOM, {
    variables: { id: cid },
  });

  const {
    data: sub_data_assignment,
    loading: sub_loading_assignment,
    error: sub_error_assignment,
  } = useSubscription(SUB_GET_ASSIGNMENT, {
    variables: { id: aid },
  });

  // initiate mutations
  const [editAssignment] = useMutation(EDIT_ASSIGNMENT);

  // handles
  // handle actions
  const handleFileChange = async (file) => {
    setTempFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

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
        const response = await axios.post(
          "/api/proxy/upload/posts/image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

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
        const response = await axios.post(
          "/api/proxy/upload/posts/file",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

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

  // // create assignment
  const handleEditAssignment = async (status) => {
    setLoading(status);

    try {
      // remove null or '' from members
      const fixedAudience = audience.filter((a) => a !== null && a !== "");
      const parsedDeadline = deadline ? deadline.toAbsoluteString() : null;

      if (!title) {
        setError("Please enter a title for the assignment.");
        setLoading(false);
        return;
      }

      if (!content) {
        setError("Please enter the content of the assignment.");
        setLoading(false);
        return;
      }

      const { data } = await editAssignment({
        variables: {
          id: aid,
          title,
          content,
          files,
          status,
          aud: fixedAudience,
          deadline: parsedDeadline,
        },
      });

      if (data.update_assignments_by_pk.id) {
        setSuccess("Assignment updated successfully.");

        // redirect the user to the note
        window.location.href = `/classroom/${cid}/assignment/${data.update_assignments_by_pk.id}`;
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  // set the values
  React.useEffect(() => {
    if (sub_data_assignment?.assignments_by_pk) {
      setTitle(sub_data_assignment.assignments_by_pk.title);
      setContent(sub_data_assignment.assignments_by_pk.content);
      setFiles(sub_data_assignment.assignments_by_pk.files);
      setAudience(sub_data_assignment.assignments_by_pk.audience);

      // 2025-03-28T16:10:06+00:00 to ISO string
      const parsedDeadline = parseAbsoluteToLocal(
        sub_data_assignment.assignments_by_pk.deadline
      );

      setDeadline(parsedDeadline);
    }
  }, [sub_data_assignment]);

  // auto hide
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [error]);

  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
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

  if (sub_loading) return <Loading />;
  if (!sub_loading_assignment) {
    // current user
    const currentUser = sub_data?.classrooms_by_pk?.classroom_relation.find(
      (cr) => cr.user.id === user.sub
    );
    if (!sub_data_assignment?.assignments_by_pk) return <NotFoundPage />;
    if (currentUser?.role !== "owner" && currentUser?.role !== "teacher")
      return <NotFoundPage />;
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-black mb-5 font-exo">Edit Assignment</h1>
        {error && (
          <Alert
            color="danger"
            className="mb-5"
            title="Something went wrong"
            description={error}
            onClose={() => setError(null)}
          />
        )}

        {success && (
          <Alert
            color="success"
            className="mb-5"
            title={success}
            onClose={() => setSuccess(null)}
          />
        )}

        {openPicker && (
          <MemberSelector
            my_id={user.sub}
            members={sub_data?.classrooms_by_pk?.classroom_relation}
            audience={audience}
            setAudience={setAudience}
            setOpenPicker={setOpenPicker}
          />
        )}
        <div>
          <div className="my-4">
            <Input
              label="Assignment Title"
              className="w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            {content ? (
              <TinyEditor
                onInit={(evt, editor) => (editorRef.current = editor)}
                init={{
                  height: 750,
                  menubar: true,
                  branding: false,
                  placeholder: "Write your assignment's instructions here...",
                  toolbar:
                    "undo redo | fontselect fontsizeselect | bold italic underline strikethrough | forecolor backcolor | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | link image table codesample emoticons | removeformat",
                  content_style:
                    "body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; }",
                  // autosave_ask_before_unload: true,
                  // autosave_interval: "30s",
                  // autosave_prefix: "classigoo-note-autosave-{path}{query}-{id}-",
                  // autosave_restore_when_empty: true,
                  paste_data_images: true,
                  image_uploadtab: true,
                  menu: {
                    view: {
                      title: "View",
                      items: "visualaid visualblocks visualchars fullscreen",
                    },
                    tools: {
                      title: "Tools",
                      items: "wordcount",
                    },
                  },
                  file_picker_callback: function (callback, value, meta) {
                    const input = document.createElement("input");
                    input.setAttribute("type", "file");
                    input.setAttribute("accept", "image/*");
                    input.onchange = function () {
                      const file = this.files[0];
                      const reader = new FileReader();
                      reader.onload = function () {
                        callback(reader.result, { alt: file.name });
                      };
                      reader.readAsDataURL(file);
                    };
                    input.click();
                  },
                }}
                initialValue="<p>This is the initial content of the editor</p>"
                value={content}
                onChange={(content) => setContent(content)}
                suppressHydrationWarning
              />
            ) : (
              <div className="border-2 rounded-xl border-gray-300 h-48 border-dashed grid content-center justify-center">
                <Icon
                  icon="eos-icons:three-dots-loading"
                  className="text-success-500 text-5xl"
                />
              </div>
            )}
          </div>

          {/* the file picker */}
          <div className="my-5">
            {files.length !== 0 && (
              <div className="border-2 border-dashed border-content2 p-5 rounded-lg mb-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="bg-content2 p-3 rounded-lg flex items-center justify-between w-full"
                    >
                      <div className="flex-initial pr-2">
                        <div className="w-24 h-24 grid justify-center content-center border-2 border-default-200 rounded-lg">
                          {file.type === "image" ? (
                            <img
                              src={`${process.env.CLASSROOM_CDN_URL}/${file.location}`}
                              alt={file.name}
                              className="h-16 w-auto object-cover"
                            />
                          ) : (
                            <Icon
                              icon="akar-icons:file"
                              className="h-16 w-auto object-cover"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex-auto">
                        <p className="text-gray-600 dark:text-gray-400 text-xs break-words break-all pr-2">
                          {file.name}
                        </p>
                      </div>
                      <div className="flex-initial pr-2">
                        <button
                          className=""
                          onClick={() => handleDeleteFile([file.location])}
                          disabled={deleting}
                        >
                          {deleting ? (
                            <Icon
                              icon="eos-icons:three-dots-loading"
                              className="text-danger-500 text-xl"
                            />
                          ) : (
                            <Icon
                              icon="mingcute:delete-2-fill"
                              className="text-danger-500 text-xl"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex">
                <div className="flex-initial">
                  <Button
                    variant="text"
                    className="bg-content2 font-medium w-12 h-12 rounded-full p-1"
                    onPress={() => setFilePicker("image")}
                    isIconOnly={true}
                  >
                    <Icon
                      icon="stash:image-plus-duotone"
                      className="text-3xl"
                    />
                  </Button>
                </div>
                <div className="flex-initial ml-2">
                  <Button
                    variant="text"
                    className="bg-content2 font-medium w-12 h-12 rounded-full p-1"
                    onPress={() => setFilePicker("file")}
                    isIconOnly={true}
                  >
                    <Icon icon="mage:file-plus" className="text-3xl" />
                  </Button>
                </div>
                <div className="flex-auto"></div>
              </div>
            </div>
          </div>

          {/* bottom */}
          <div className="my-5 flex gap-5">
            <div className="flex-1 grid items-center">
              <div
                className="flex-1  bg-content2 hover:bg-gray-200 dark:hover:bg-neutral-700 p-3 rounded-xl h-full relative cursor-pointer max-h-[55px]"
                onClick={() => setOpenPicker(true)}
              >
                <label className="text-xs text-gray-600 dark:text-neutral-300 absolute top-2">
                  Audience
                </label>
                <p className="text-small pt-3">
                  {audience.length === 0
                    ? "Teachers"
                    : audience[0] == "*"
                    ? "All"
                    : "Custom"}
                </p>
              </div>
            </div>
            <div className="flex-1 grid items-center">
              <DatePicker
                hideTimeZone={false}
                showMonthAndYearPickers
                // defaultValue={deadline}
                value={deadline}
                onChange={setDeadline}
                label="Submission Deadline"
                variant="flat"
              />
            </div>
            <div className="flex-1">
              <div className="my-5 grid items-center">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="text"
                    isLoading={loading === "draft"}
                    isDisabled={loading === "published"}
                    className="bg-primary-500 text-background rounded-none font-medium"
                    onPress={() => {
                      handleEditAssignment("draft");
                    }}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="text"
                    isLoading={loading === "published"}
                    isDisabled={loading === "draft"}
                    className="bg-black dark:bg-white text-background rounded-none font-medium"
                    onPress={() => {
                      handleEditAssignment("published");
                    }}
                  >
                    Save & Publish
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {filePicker && (
        <div className="bg-black/5 fixed inset-0 z-50 flex items-center justify-center top-0 left-0 right-0 bottom-0 backdrop-blur-[5px]">
          <div className="bg-white dark:bg-black p-5 rounded-xl max-w-[90%] w-[512px]">
            {tempFile ? (
              filePicker === "file" ? (
                <div className="">
                  <div className="flex justify-center content-center">
                    <Icon
                      icon="akar-icons:file"
                      className="h-full w-36 text-default-400 py-5"
                    />
                  </div>
                  <p className="text-center text-xs text-gray-500">
                    {tempFile.name} - {tempFile.size / 1000000}MB
                  </p>
                </div>
              ) : (
                <div className="flex justify-center content-center">
                  <img
                    src={tempFilePreview}
                    alt="Profile"
                    className="h-48 w-auto object-cover rounded-lg"
                  />
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
                  <Icon
                    icon="akar-icons:upload"
                    className="h-8 w-8 text-default-400"
                  />
                  <p className="text-sm text-default-400">
                    Drag and drop your profile picture here or click to upload.
                  </p>
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

            {fileError && (
              <Alert
                className="my-2"
                color="danger"
                title="Error"
                description={fileError}
              />
            )}

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
    </>
  );
}
