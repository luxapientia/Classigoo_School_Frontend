"use client";
import xss from "xss";
import axios from "axios";
import React from "react";
import moment from "moment";
import Link from "next/link";
import NotFoundPage from "@app/not-found";
import "@components/common/tinymce.css";
import { Alert, Button, User, Table, TableHeader, TableBody, TableColumn, TableCell, TableRow } from "@heroui/react";
import Loading from "@components/common/loading";
import DeleteAssignmentAction from "./delete-assignment-action";
import ClassroomLayout from "../../layout/layout";
import { Icon } from "@iconify/react";
import { FileUploader } from "react-drag-drop-files";
import { useMutation, useSubscription } from "@apollo/client";
import { SUB_GET_ASSIGNMENT, SUB_GET_CLASSROOM } from "@graphql/subscriptions";
import { DELETE_ASSIGNMENT, CREATE_ASSIGNMENT_SUBMISSION, UPDATE_ASSIGNMENT_SUBMISSION } from "@graphql/mutations";

export default function AssignmentPageMainComponent({ user, cid, aid }) {
  const [deleteAssignment] = useMutation(DELETE_ASSIGNMENT);
  const [setSubmission] = useMutation(CREATE_ASSIGNMENT_SUBMISSION);
  const [updateSubmission] = useMutation(UPDATE_ASSIGNMENT_SUBMISSION);
  const [d_error, setError] = React.useState(null);
  const [filePicker, setFilePicker] = React.useState(false);
  const [fileError, setFileError] = React.useState(null);
  const [fileSuccess, setFileSuccess] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);
  const [doing, setDoing] = React.useState(false);
  const [success, setSuccess] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [mySubmission, setMySubmission] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [submissionStatus, setSubmissionStatus] = React.useState("");
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [assignMentFiles, setAssignmentFiles] = React.useState([]);
  const [tempAssignmentFile, setTempAssignmentFile] = React.useState(null);

  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_GET_CLASSROOM, {
    variables: { id: cid },
  });

  const {
    data: sub_assignment_data,
    loading: sub_assignment_loading,
    error: sub_assignment_error,
  } = useSubscription(SUB_GET_ASSIGNMENT, {
    variables: { id: aid },
  });

  const currentUser = sub_data?.classrooms_by_pk?.classroom_relation.find((cr) => cr.user.id === user.sub);

  const handleDeleteAssignment = async () => {
    setDeleteLoading(true);
    try {
      await deleteAssignment({
        variables: { id: aid },
      });
      window.location.replace(`/classroom/${cid}/assignments`);
    } catch (error) {
      setError(error);
      setDeleteLoading(false);
    }
    setShowDeleteModal(false);
  };

  // handle file change
  const handleFileChange = (file) => {
    setTempAssignmentFile(file);
  };

  const handleFileUpload = async () => {
    setLoading(true);
    setSuccess("");
    setFileError("");
    try {
      if (!tempAssignmentFile) {
        setFileError("Please select a file to upload.");
        return;
      }

      let formData = new FormData();
      formData.append("file", tempAssignmentFile);

      // post form data image
      const response = await axios.post("/api/proxy/upload/posts/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      let fileSize;

      if (tempAssignmentFile.size < 1024) {
        fileSize = `${tempAssignmentFile.size} bytes`;
      } else if (tempAssignmentFile.size >= 1024 && tempAssignmentFile.size < 1048576) {
        fileSize = `${(tempAssignmentFile.size / 1024).toFixed(2)} KB`;
      } else {
        fileSize = `${(tempAssignmentFile.size / 1048576).toFixed(2)} MB`;
      }

      if (response.data.status === "success") {
        setFileSuccess("File uploaded successfully.");
        // if user submission is not null then update the submission or create a new submission
        const updatedFileList = mySubmission
          ? mySubmission.files.concat({
              type: "file",
              name: response.data.data.name,
              mimetype: response.data.data.type,
              location: response.data.data.location,
              size: fileSize,
            })
          : [
              {
                type: "file",
                name: response.data.data.name,
                mimetype: response.data.data.type,
                location: response.data.data.location,
                size: fileSize,
              },
            ];

        if (mySubmission) {
          await updateSubmission({
            variables: {
              id: mySubmission.id,
              files: updatedFileList,
              status: mySubmission.status,
            },
          });
        } else {
          await setSubmission({
            variables: {
              aid: aid,
              files: updatedFileList,
              status: "draft",
            },
          });
        }

        if (assignMentFiles?.length > 0) {
          setAssignmentFiles((prev) =>
            prev.concat({
              type: "file",
              name: response.data.data.name,
              mimetype: response.data.data.type,
              location: response.data.data.location,
              size: fileSize,
            })
          );
        } else {
          setAssignmentFiles([
            {
              type: "file",
              name: response.data.data.name,
              mimetype: response.data.data.type,
              location: response.data.data.location,
              size: fileSize,
            },
          ]);
        }

        setTempAssignmentFile(null);
        setFilePicker(false);
      } else {
        setFileError(response.data.message);
      }
      setLoading(false);
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

        // if set assignment is an array of files then remove the files from the array
        if (assignMentFiles?.length > 0) {
          setAssignmentFiles((prev) => prev.filter((f) => !locations.includes(f.location)));
        } else {
          // if set assignment is not an array of files then remove the file from the array
          setAssignmentFiles([]);
        }
      }

      if (response.data.status === "error") {
        setFileError(response.data.message);
      } else {
        // update the submission
        await updateSubmission({
          variables: {
            id: mySubmission.id,
            files: mySubmission.files.filter((f) => !locations.includes(f.location)),
            status: mySubmission.status,
          },
        });
        setFileSuccess("File deleted successfully.");
      }
    } catch (err) {
      // console.log(err);
      setFileError(err.message);
    }
    setDeleting(false);
  };

  const handleSubmitAssignment = async () => {
    setDoing(true);

    try {
      // if no user files
      if (assignMentFiles.length === 0) {
        setFileError("Please attach a file to submit.");
        return;
      }

      // moment check if the deadline is passed
      if (isPastDeadline) {
        setFileError("Assignment submission deadline has passed.");
        return;
      }

      // update the submission status to submitted
      await updateSubmission({
        variables: {
          id: mySubmission.id,
          files: assignMentFiles,
          status: "published",
        },
      });
      setSuccess("Assignment submitted successfully.");
      setSubmissionStatus("published");
      setDoing(false);
    } catch (err) {
      setError(err.message);
      setDoing(false);
    }
  };

  const handleUnsubmitAssignment = async () => {
    setDoing(true);
    try {
      // moment check if the deadline is passed
      if (isPastDeadline) {
        setFileError("Assignment submission deadline has passed.");
        return;
      }

      // update the submission status to draft
      await updateSubmission({
        variables: {
          id: mySubmission.id,
          files: assignMentFiles,
          status: "draft",
        },
      });
      setSuccess("Assignment unsubmitted successfully.");
      setSubmissionStatus("draft");
      setDoing(false);
    } catch (err) {
      setError(err.message);
      setDoing(false);
    }
  };

  React.useEffect(() => {
    if (d_error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [d_error]);

  React.useEffect(() => {
    if (fileError) {
      const timer = setTimeout(() => {
        setFileError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [fileError]);

  React.useEffect(() => {
    if (fileSuccess) {
      const timer = setTimeout(() => {
        setFileSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [fileSuccess]);

  React.useEffect(() => {
    if (sub_assignment_data?.assignments_by_pk) {
      // get my submissions
      const mySub = sub_assignment_data.assignments_by_pk.assignment_submissions.find(
        (s) => s.submitter.id === user.sub
      );
      setMySubmission(mySub);
      setAssignmentFiles(mySub?.files);
      setSubmissionStatus(mySub?.status || "draft");
    }
  }, [sub_assignment_data]);

  // if not found
  if (!sub_assignment_loading && !sub_assignment_data?.assignments_by_pk) {
    return <NotFoundPage />;
  }

  const isPastDeadline = moment(sub_assignment_data?.assignments_by_pk?.deadline).isBefore(moment());

  // if student and status is draft then don't show the assignment
  if (currentUser?.role === "student" && sub_assignment_data?.assignments_by_pk?.status === "draft") {
    return <NotFoundPage />;
  }

  // if audience is not all and current user is not in the audience then don't show the assignment
  if (
    currentUser?.role === "student" &&
    !sub_assignment_data?.assignments_by_pk?.audience.includes("*") &&
    !sub_assignment_data?.assignments_by_pk?.audience.includes(user.sub)
  ) {
    return <NotFoundPage />;
  }

  return (
    <>
      {showDeleteModal && (
        <DeleteAssignmentAction
          handleSubmit={handleDeleteAssignment}
          handleClose={() => setShowDeleteModal(false)}
          loading={deleteLoading}
        />
      )}
      <ClassroomLayout id={cid} loading={sub_loading || sub_assignment_loading} classroom={sub_data?.classrooms_by_pk}>
        {fileSuccess && (
          <div className="mb-4">
            <Alert color="success" title="Success!" description={fileSuccess} />
          </div>
        )}
        {success && (
          <div className="mb-4">
            <Alert color="success" title={success} />
          </div>
        )}
        <div className="flex flex-col gap-4">
          {d_error && (
            <div className="mb-4">
              <Alert color="danger" title="Something went wrong!" description={d_error.message} />
            </div>
          )}

          <h1 className="text-2xl  p-5 bg-content2 font-bold rounded-xl">
            {sub_assignment_data?.assignments_by_pk?.title}
          </h1>
          <div className="flex gap-4 max-w-full w-full">
            <div className="flex-auto flex flex-col overflow-x-auto">
              <div className="flex-auto px-10 py-4 bg-content2 rounded-xl h-full overflow-x-auto">
                <article
                  id="editor_rendered"
                  className="prose max-w-none prose-lg prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-md prose-ul:list-disc prose-ol:list-decimal prose-table:border-collapse prose-table:border prose-table:border-gray-300 prose-th:border prose-th:p-2 prose-th:bg-gray-100 prose-td:border prose-td:p-2 prose-td:text-gray-700"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: xss(sub_assignment_data?.assignments_by_pk?.content),
                    }}
                  ></div>
                </article>
              </div>
              {/* if files */}
              {sub_assignment_data?.assignments_by_pk?.files.length > 0 && (
                <div className="mt-5 flex-initial">
                  <div className="">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {sub_assignment_data?.assignments_by_pk?.files.map((file, index) => (
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
                                <Icon icon="akar-icons:file" className="h-16 w-auto object-cover" />
                              )}
                            </div>
                          </div>
                          <div className="flex-auto">
                            <p className="text-gray-600 dark:text-gray-400 text-xs break-words break-all pr-2">
                              {file.name}
                            </p>
                            {/* file size and data */}
                            <p className="text-gray-400 text-xs mt-1">{file.size}</p>
                          </div>
                          <div className="flex-initial pr-2">
                            <Link
                              href={`${process.env.CLASSROOM_CDN_URL}/${file.location}`}
                              target="_blank"
                              className="text-black dark:text-white"
                            >
                              <Icon icon="akar-icons:download" className="h-6 w-6" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-initial">
              <div className="p-5 bg-content2 w-72 rounded-xl">
                <h1 className="text-xl font-bold mb-2">Author</h1>

                <User
                  avatarProps={{
                    src: sub_assignment_data?.assignments_by_pk?.owner?.avatar,
                    alt: sub_assignment_data?.assignments_by_pk?.owner?.name,
                  }}
                  name={sub_assignment_data?.assignments_by_pk?.owner?.name}
                  description={sub_assignment_data?.assignments_by_pk?.owner?.email}
                />
              </div>

              <div className="p-5 bg-content2 w-72 rounded-xl mt-4">
                <h2 className="text-sm">
                  Status:{" "}
                  <span className="font-semibold">{sub_assignment_data?.assignments_by_pk?.status.toUpperCase()}</span>
                </h2>
                <h2 className="text-sm">
                  Last Updated:{" "}
                  <span className="font-semibold">
                    {moment(sub_assignment_data?.assignments_by_pk?.updated_at).fromNow()}
                  </span>
                </h2>
                <h2 className="text-sm text-danger-500 dark:text-danger-400">
                  Deadline:{" "}
                  <span className="font-semibold">
                    {moment(sub_assignment_data?.assignments_by_pk?.deadline).format("MMM DD, YYYY hh:mm A")}
                  </span>
                </h2>
              </div>
              {/* if current user is the student */}
              {currentUser?.role === "student" && (
                <div className="p-5 bg-content2 w-72 rounded-xl mt-4">
                  <h2 className="text-sm font-exo font-bold">
                    Submit Assignment
                    {submissionStatus === "draft" ? (
                      <span className="text-xs text-red-500 dark:text-red-400"> (Draft)</span>
                    ) : (
                      <span className="text-xs text-green-500 dark:text-green-400"> (Submitted)</span>
                    )}
                  </h2>
                  {assignMentFiles?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {assignMentFiles.map((file, index) => (
                        <div key={index} className="bg-content1 text-content1-foreground rounded-lg p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex-initial h-8 w-8 grid justify-center content-center rounded-md bg-gray-300 dark:bg-gray-600">
                              <Icon icon="solar:document-bold-duotone" className="h-5 w-5" />
                            </div>
                            <div className="flex-auto pl-3">
                              {/* file name first5chars...last5chars */}
                              <Link
                                href={`${process.env.CLASSROOM_CDN_URL}/${file.location}`}
                                target="_blank"
                                className="text-xs text-gray-600 dark:text-gray-400 hover:underline"
                              >
                                <p className="text-xs">
                                  {file.name.length > 30
                                    ? `${file.name.substring(0, 10)}...${file.name.substring(file.name.length - 5)}`
                                    : file.name}
                                </p>
                              </Link>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400">{file.size}</p>
                            </div>
                            {submissionStatus === "draft" && !isPastDeadline && (
                              <button
                                onClick={() => handleDeleteFile([file.location])}
                                disabled={deleting}
                                className="bg-danger-500 h-8 w-8 rounded-md flex items-center justify-center"
                              >
                                {deleting ? (
                                  <Icon icon="eos-icons:three-dots-loading" className="h-5 w-5 text-white" />
                                ) : (
                                  <Icon
                                    icon="solar:trash-bin-minimalistic-bold-duotone"
                                    className="h-5 w-5 text-white"
                                  />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400 h-10 border-2 border-dashed rounded-lg p-2 mt-2 text-center grid content-center">
                      No files attached
                    </p>
                  )}
                  {submissionStatus === "draft" && !isPastDeadline && (
                    <button
                      onClick={() => setFilePicker(true)}
                      className="bg-content1 text-content1-foreground rounded-lg font-medium w-full py-2 mt-2 flex items-center justify-center"
                    >
                      <Icon icon="solar:document-add-bold-duotone" className="h-4 w-4 text-content1-foreground" />
                      <span className="pl-1">Add Files</span>
                    </button>
                  )}
                  {isPastDeadline ? (
                    <p className="text-xs text-danger-500 dark:text-danger-400 mt-2 italic">
                      Assignment submission deadline has passed. So you can't submit or unsubmit the assignment.
                    </p>
                  ) : submissionStatus === "draft" ? (
                    <button
                      onClick={handleSubmitAssignment}
                      className="bg-primary-500 text-background rounded-lg font-medium w-full py-2 mt-2 flex items-center justify-center"
                    >
                      {doing ? (
                        <Icon icon="eos-icons:three-dots-loading" className="h-6 w-6 text-background" />
                      ) : (
                        <>
                          <Icon icon="solar:user-hand-up-line-duotone" className="h-4 w-4 text-background" />
                          <span className="pl-1">Hand In</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleUnsubmitAssignment}
                      className="bg-red-500 text-background rounded-lg font-medium w-full py-2 mt-2 flex items-center justify-center"
                    >
                      {doing ? (
                        <Icon icon="eos-icons:three-dots-loading" className="h-6 w-6 text-background" />
                      ) : (
                        <>
                          <Icon icon="solar:user-hands-line-duotone" className="h-4 w-4 text-background" />
                          <span className="pl-1">Unsubmit</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* if current user is the owner or teacher */}
              {(currentUser?.role === "owner" || currentUser?.role === "teacher") && (
                <div className="p-5 bg-content2 w-72 rounded-xl mt-4">
                  <div className="w-full">
                    <Link href={`/classroom/${cid}/assignment/${aid}/edit`}>
                      <div className="bg-primary-500 text-background rounded-lg font-medium w-full cursor-pointer text-center py-2">
                        Edit
                      </div>
                    </Link>
                  </div>

                  <div className="mt-2 w-full">
                    <Button
                      variant="text"
                      className="bg-red-500 text-background rounded-lg font-medium w-full"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {currentUser?.role !== "student" && (
            <div className="mt-16 pt-10 border-t-2 border-gray-200 dark:border-gray-700 border-dotted">
              <h1 className="text-2xl font-bold font-exo  text-gray-700 dark:text-gray-200">Student Submissions</h1>
              <div className="mt-5">
                <Table aria-label="Example empty table">
                  <TableHeader>
                    <TableColumn>#</TableColumn>
                    <TableColumn>STUDENT</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn className="w-fit-content">FILES</TableColumn>
                    <TableColumn>LAST UPDATED</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={"No submissions found"}>
                    {sub_assignment_data?.assignments_by_pk?.assignment_submissions.map((submission, index) => (
                      <TableRow key={submission.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <User
                            avatarProps={{
                              src: submission.submitter.avatar,
                            }}
                            description={
                              <h4 className="text-sm text-gray-500 dark:text-gray-400">{submission.submitter.email}</h4>
                            }
                            name={submission.submitter.name}
                            size="md"
                          />
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs font-semibold ${
                              submission.status === "draft"
                                ? "text-red-500 dark:text-red-400"
                                : "text-green-500 dark:text-green-400"
                            }`}
                          >
                            {submission.status.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="w-fit-content">
                          <div className="grid grid-cols-1 gap-1">
                            {submission.files.map((file, index) => (
                              <div key={index} className="bg-content1 text-content1-foreground rounded-lg p-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex-initial h-8 w-8 grid justify-center content-center rounded-md bg-gray-300 dark:bg-gray-600">
                                    <Icon icon="solar:document-bold-duotone" className="h-5 w-5" />
                                  </div>
                                  <div className="flex-auto pl-3">
                                    {/* file name first5chars...last5chars */}
                                    <Link
                                      href={`${process.env.CLASSROOM_CDN_URL}/${file.location}`}
                                      target="_blank"
                                      className="text-xs text-gray-600 dark:text-gray-400 hover:underline"
                                    >
                                      <p className="text-xs size-fit">
                                        {file.name.length > 30
                                          ? `${file.name.substring(0, 10)}...${file.name.substring(
                                              file.name.length - 5
                                            )}`
                                          : file.name}
                                      </p>
                                    </Link>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400  size-fit">
                                      {file.size}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{moment(submission.updated_at).fromNow()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </ClassroomLayout>
      {filePicker && (
        <div className="bg-black/5 fixed inset-0 z-50 flex items-center justify-center top-0 left-0 right-0 bottom-0 backdrop-blur-[5px]">
          <div className="bg-white dark:bg-black p-5 rounded-xl max-w-[90%] w-[512px]">
            {tempAssignmentFile ? (
              <div className="">
                <div className="flex justify-center content-center">
                  <Icon icon="akar-icons:file" className="h-full w-36 text-default-400 py-5" />
                </div>
                <p className="text-center text-xs text-gray-500">
                  {tempAssignmentFile.name} - {tempAssignmentFile.size / 1000000}MB
                </p>
              </div>
            ) : (
              <FileUploader
                handleChange={handleFileChange}
                // free users 10mb pro users 50mb
                maxSize={user?.user?.is_plus ? 50 : 10}
                overRide
              >
                <div className="border-2 border-dotted border-default-200 rounded-lg flex items-center justify-center px-4 py-8 mb-2">
                  <Icon icon="akar-icons:upload" className="h-8 w-8 text-default-400" />
                  <p className="text-sm text-default-400">
                    Drag and drop your profile picture here or click to upload.
                  </p>
                </div>
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
                  setTempAssignmentFile(null);
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
                isDisabled={!tempAssignmentFile || loading}
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
