"use client";
import xss from "xss";
import axios from "axios";
import React from "react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotFoundPage from "@app/not-found";
import "@components/common/tinymce.css";
import { Alert, Button, User, Table, TableHeader, TableBody, TableColumn, TableCell, TableRow } from "@heroui/react";
import DOMPurify from "dompurify";
import Loading from "@components/common/loading";
import DeleteExamAction from "./delete-exam-action";
import ClassroomLayout from "../../layout/layout";
import { Icon } from "@iconify/react";
import { FileUploader } from "react-drag-drop-files";
import { useMutation, useSubscription } from "@apollo/client";
import { SUB_GET_EXAM, SUB_GET_CLASSROOM, SUB_GET_MY_SUBMISSIONS, SUB_LIST_SUBMISSIONS } from "@graphql/subscriptions";
import { DELETE_EXAM, ADD_EXAM_SUBMISSION_ENTRY } from "@graphql/mutations";

export default function ExamPageMainComponent({ user, cid, eid }) {
  const router = useRouter();

  const [deleteExam] = useMutation(DELETE_EXAM);
  const [addSubmissionEntry] = useMutation(ADD_EXAM_SUBMISSION_ENTRY);
  // const [setSubmission] = useMutation(CREATE_ASSIGNMENT_SUBMISSION);
  // const [updateSubmission] = useMutation(UPDATE_ASSIGNMENT_SUBMISSION);
  const [d_error, setError] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);
  const [doing, setDoing] = React.useState(false);
  const [success, setSuccess] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [starting, setStarting] = React.useState(false);
  const [submissions, setSubmissions] = React.useState([]);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [submissionStatus, setSubmissionStatus] = React.useState("FETCHING...");
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_GET_CLASSROOM, {
    variables: { id: cid },
  });

  const {
    data: sub_exams_data,
    loading: sub_exams_loading,
    error: sub_exams_error,
  } = useSubscription(SUB_GET_EXAM, {
    variables: { id: eid },
  });

  const {
    data: sub_my_submission_data,
    loading: sub_my_submission_loading,
    error: sub_my_submission_error,
  } = useSubscription(SUB_GET_MY_SUBMISSIONS, {
    variables: { uid: user.sub, eid: eid },
  });

  const {
    data: sub_list_submissions_data,
    loading: sub_list_submissions_loading,
    error: sub_list_submissions_error,
  } = useSubscription(SUB_LIST_SUBMISSIONS, {
    variables: { eid: eid },
  });

  const currentUser = sub_data?.classrooms_by_pk?.classroom_relation.find((cr) => cr.user.id === user.sub);

  const handleDeleteExam = async () => {
    setDeleteLoading(true);
    try {
      await deleteExam({
        variables: {
          eid: eid,
        },
      });
      router.push(`/classroom/${cid}/exams`);
    } catch (error) {
      setError(error);
      setDeleteLoading(false);
    }
    setShowDeleteModal(false);
  };

  // handle start exam
  const handleStartExam = async () => {
    setStarting(true);
    try {
      if (currentUser?.role === "student") {
        if (sub_my_submission_data?.exam_submissions?.length !== 0) {
          router.push(`/classroom/${cid}/exam/${eid}/start/${sub_my_submission_data?.exam_submissions[0].id}`);
        } else {
          const newSubmission = await addSubmissionEntry({
            variables: {
              eid: eid,
              status: "draft",
            },
          });
          router.push(`/classroom/${cid}/exam/${eid}/start/${newSubmission.data.insert_exam_submissions_one.id}`);
        }
      }
    } catch (error) {
      setError(error);
    } finally {
      setStarting(false);
    }
  };

  // handle view submission
  const handleViewSubmission = async () => {
    setStarting(true);
    if (currentUser?.role === "student") {
      router.push(`/classroom/${cid}/exam/${eid}/submission/${sub_my_submission_data?.exam_submissions[0].id}`);
    }
    setStarting(false);
  };

  // caluclate submission status
  React.useEffect(() => {
    if (!sub_loading && !sub_exams_loading && !sub_my_submission_loading && !sub_list_submissions_loading) {
      const start_time = moment(sub_exams_data?.exams_by_pk?.start_once).add(
        sub_exams_data?.exams_by_pk?.duration,
        "minutes"
      );

      if (currentUser?.role === "student") {
        if (sub_my_submission_data?.exam_submissions?.length !== 0) {
          const duration_time = moment(sub_my_submission_data?.exam_submissions[0].created_at).add(
            sub_exams_data?.exams_by_pk?.duration,
            "minutes"
          );
          if (sub_my_submission_data?.exam_submissions[0].status === "draft") {
            if (sub_exams_data?.exams_by_pk?.start_once) {
              if (start_time.isAfter(moment())) {
                setSubmissionStatus("STARTED");
              } else {
                setSubmissionStatus("FINISHED");
              }
            } else if (sub_exams_data?.exams_by_pk?.duration !== 0) {
              if (duration_time.isAfter(moment())) {
                setSubmissionStatus("STARTED");
              } else {
                setSubmissionStatus("FINISHED");
              }
            } else {
              setSubmissionStatus("STARTED");
            }
          } else {
            setSubmissionStatus("FINISHED");
          }
        } else {
          if (sub_exams_data?.exams_by_pk?.start_once) {
            if (start_time.isBefore(moment())) {
              setSubmissionStatus("ENDED");
            } else {
              setSubmissionStatus("NOT STARTED");
            }
          } else {
            setSubmissionStatus("NOT STARTED");
          }
        }
      }
    }
  }, [
    sub_loading,
    sub_exams_loading,
    sub_my_submission_loading,
    sub_list_submissions_loading,
    currentUser,
    sub_data,
    sub_exams_data,
    sub_my_submission_data,
    sub_list_submissions_data,
  ]);

  React.useEffect(() => {
    if (d_error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [d_error]);

  React.useEffect(() => {
    let subs = [];
    console.log(sub_list_submissions_data?.exam_submissions);
    if (sub_list_submissions_data?.exam_submissions.length > 0) {
      if (currentUser?.role === "teacher" || currentUser?.role === "owner") {
        sub_list_submissions_data?.exam_submissions.map((submission) => {
          if (submission.status !== "draft") {
            subs.push(submission);
          } else if (sub_exams_data?.exams_by_pk?.duration !== 0) {
            if (
              sub_exams_data?.exams_by_pk?.start_once &&
              moment(sub_exams_data?.exams_by_pk?.start_once)
                .add(sub_exams_data?.exams_by_pk?.duration, "minutes")
                .isBefore(moment())
            ) {
              subs.push(submission);
            } else if (
              !sub_exams_data?.exams_by_pk?.start_once &&
              moment(submission.created_at).add(sub_exams_data?.exams_by_pk?.duration, "minutes").isBefore(moment())
            ) {
              subs.push(submission);
            }
          }
        });
      }
    }
    setSubmissions(subs);
  }, [sub_list_submissions_data, currentUser, sub_exams_data]);

  if (!sub_loading && !sub_exams_loading && !sub_my_submission_loading && !sub_list_submissions_loading) {
    // if not found
    if (!sub_data?.classrooms_by_pk && !sub_exams_data?.exams_by_pk) {
      return <NotFoundPage />;
    }

    // if exam is not for everyone and current user is not in the audience
    if (
      currentUser?.role === "student" &&
      !sub_exams_data?.exams_by_pk?.audience.includes("*") &&
      !sub_exams_data?.exams_by_pk?.audience.includes(currentUser?.user.id)
    ) {
      return <NotFoundPage />;
    }

    // if draft
    if (sub_exams_data?.exams_by_pk?.status === "draft" && currentUser?.role === "student") {
      return <NotFoundPage />;
    }
  }

  return (
    <>
      {showDeleteModal && (
        <DeleteExamAction
          handleSubmit={handleDeleteExam}
          handleClose={() => setShowDeleteModal(false)}
          loading={deleteLoading}
        />
      )}
      <ClassroomLayout id={cid} loading={sub_loading || sub_exams_loading} classroom={sub_data?.classrooms_by_pk}>
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

          <h1 className="text-2xl  p-5 bg-content2 font-bold rounded-xl">{sub_exams_data?.exams_by_pk?.title}</h1>
          <div className="flex gap-4 max-w-full w-full">
            <div className="flex-auto flex flex-col overflow-x-auto">
              <div className="flex-auto px-10 py-4 bg-content2 rounded-xl h-full overflow-x-auto">
                <article
                  id="editor_rendered"
                  className="prose max-w-none prose-lg prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-md prose-ul:list-disc prose-ol:list-decimal prose-table:border-collapse prose-table:border prose-table:border-gray-300 prose-th:border prose-th:p-2 prose-th:bg-gray-100 prose-td:border prose-td:p-2 prose-td:text-gray-700"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: xss(sub_exams_data?.exams_by_pk?.content),
                    }}
                  ></div>
                </article>
              </div>
            </div>
            <div className="flex-initial">
              <div className="p-5 bg-content2 w-72 rounded-xl">
                <h1 className="text-xl font-bold mb-2">Author</h1>

                <User
                  avatarProps={{
                    src: sub_exams_data?.exams_by_pk?.owner?.avatar,
                    alt: sub_exams_data?.exams_by_pk?.owner?.name,
                  }}
                  name={sub_exams_data?.exams_by_pk?.owner?.name}
                  description={sub_exams_data?.exams_by_pk?.owner?.email}
                />
              </div>

              <div className="p-5 bg-content2 w-72 rounded-xl mt-4">
                <h2 className="text-sm">
                  Status: <span className="font-semibold">{sub_exams_data?.exams_by_pk?.status.toUpperCase()}</span>
                </h2>
                <h2 className="text-sm">
                  Last Updated:{" "}
                  <span className="font-semibold">{moment(sub_exams_data?.exams_by_pk?.updated_at).fromNow()}</span>
                </h2>
                {sub_exams_data?.exams_by_pk?.start_once !== null && (
                  <h2 className="text-sm text-danger-500 dark:text-danger-400">
                    Starts on:{" "}
                    <span className="font-semibold">
                      {moment(sub_exams_data?.exams_by_pk?.start_once).format("MMM DD, YYYY hh:mm A")}
                    </span>
                  </h2>
                )}

                {sub_exams_data?.exams_by_pk?.duration !== 0 && sub_exams_data?.exams_by_pk?.duration !== null && (
                  <h2 className="text-sm">
                    Exam Duration:{" "}
                    <span className="font-semibold">{sub_exams_data?.exams_by_pk?.duration} minutes</span>
                  </h2>
                )}

                {currentUser?.role === "student" && (
                  <h2 className="text-sm">
                    Submission Status: <span className="font-semibold">{submissionStatus}</span>
                  </h2>
                )}
              </div>
              {/* if current user is the student */}
              {currentUser?.role === "student" && (
                <div className="p-5 bg-content2 w-72 rounded-xl mt-4">
                  {/* if start at */}
                  {submissionStatus === "NOT STARTED" && (
                    <Button
                      variant="text"
                      className="bg-primary-500 text-background rounded-lg font-medium w-full py-2"
                      onClick={handleStartExam}
                      isLoading={starting}
                    >
                      Start Exam
                    </Button>
                  )}

                  {/* if started */}
                  {submissionStatus === "STARTED" && (
                    <Button
                      variant="text"
                      className="bg-primary-500 text-background rounded-lg font-medium w-full py-2"
                      onClick={handleStartExam}
                      isLoading={starting}
                    >
                      Continue Exam
                    </Button>
                  )}

                  {/* if finished */}
                  {submissionStatus === "FINISHED" && (
                    <>
                      <Button
                        variant="text"
                        className="bg-primary-500 text-background rounded-lg font-medium w-full py-2"
                        onClick={handleViewSubmission}
                        isLoading={starting}
                      >
                        View Submission
                      </Button>
                      <p className="text-sm text-center pt-1">
                        <span className="text-danger-500 dark:text-danger-400 italic text-xs font-medium">
                          Exam has ended!
                        </span>
                      </p>
                    </>
                  )}

                  {/* if ended */}
                  {submissionStatus === "ENDED" && (
                    <p className="text-sm text-center pt-1">
                      <span className="text-danger-500 dark:text-danger-400 italic text-xs font-medium">
                        Exam has ended! You can no longer submit.
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* if current user is the owner or teacher */}
              {(currentUser?.role === "owner" || currentUser?.role === "teacher") && (
                <div className="p-5 bg-content2 w-72 rounded-xl mt-4">
                  <div className="w-full">
                    <Link href={`/classroom/${cid}/exam/${eid}/edit`}>
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
                    <TableColumn>LAST UPDATED</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={"No submissions found"}>
                    {/* the action will be if draft then evaluate if evdraft then continue evaluating if evaluated then evaluated */}
                    {submissions.map((submission, index) => (
                      <TableRow key={submission.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <User
                            avatarProps={{
                              src: submission.user.avatar,
                            }}
                            description={
                              <h4 className="text-sm text-gray-500 dark:text-gray-400">{submission.user.email}</h4>
                            }
                            name={submission.user.name}
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

                        <TableCell>{moment(submission.updated_at).fromNow()}</TableCell>
                        <TableCell>
                          <Link href={`/classroom/${cid}/exam/${eid}/evaluate/${submission.id}`}>
                            <Button
                              variant="text"
                              className="bg-primary-500 text-background rounded-lg font-medium w-full py-2"
                            >
                              Evaluate
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* {sub_assignment_data?.assignments_by_pk?.assignment_submissions.map((submission, index) => (
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
                    ))} */}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </ClassroomLayout>
    </>
  );
}
