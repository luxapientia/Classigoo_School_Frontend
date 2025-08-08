"use client";
import xss from "xss";
import axios from "@lib/axios";
import React from "react";
import moment from "moment";
import Link from "next/link";
import DOMPurify from "dompurify";
import { Icon } from "@iconify/react";
import "@components/common/tinymce.css";
import NotFoundPage from "@app/not-found";
import { useRouter } from "next/navigation";
import Loading from "@components/common/loading";
import ClassroomLayout from "../../layout/layout";
import DeleteExamAction from "./delete-exam-action";
import { FileUploader } from "react-drag-drop-files";
import { useSocket } from "@hooks/useSocket";
// import { useMutation, useSubscription } from "@apollo/client";
// import { DELETE_EXAM, ADD_EXAM_SUBMISSION_ENTRY } from "@graphql/mutations";
import {
  Alert,
  Button,
  User,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableCell,
  TableRow,
} from "@heroui/react";
// import {
//   SUB_GET_EXAM,
//   // SUB_GET_CLASSROOM,
//   SUB_GET_MY_SUBMISSIONS,
//   SUB_LIST_SUBMISSIONS,
// } from "@graphql/subscriptions";

export default function ExamPageMainComponent({ userInfo, cid, eid }) {
  const router = useRouter();

  // const [deleteExam] = useMutation(DELETE_EXAM);
  // const [addSubmissionEntry] = useMutation(ADD_EXAM_SUBMISSION_ENTRY);
  // const [setSubmission] = useMutation(CREATE_ASSIGNMENT_SUBMISSION);
  // const [updateSubmission] = useMutation(UPDATE_ASSIGNMENT_SUBMISSION);

  const [classroom, setClassroom] = React.useState(null);
  const [classroomLoading, setClassroomLoading] = React.useState(false);
  const [exam, setExam] = React.useState(null);
  const [examLoading, setExamLoading] = React.useState(false);
  const [mySubmissions, setMySubmissions] = React.useState([]);
  const [mySubmissionsLoading, setMySubmissionsLoading] = React.useState(false);
  const [listSubmissions, setListSubmissions] = React.useState([]);
  const [listSubmissionsLoading, setListSubmissionsLoading] = React.useState(false);
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

  // const {
  //   data: sub_data,
  //   loading: sub_loading,
  //   error: sub_error,
  // } = useSubscription(SUB_GET_CLASSROOM, {
  //   variables: { id: cid },
  // });

  // fetch classroom
  const fetchClassroom = React.useCallback(async () => {
    setClassroomLoading(true);
    try {
      const res = await axios.get(`/v1/classroom/${cid}`);
      setClassroom(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load classroom");
    }

    setClassroomLoading(false);
  }, [cid]);

  React.useEffect(() => {
    fetchClassroom();
  }, [fetchClassroom]);

  useSocket("classroom.updated", (payload) => {
    if (payload.data.id === cid) {
      fetchClassroom();
    }
  });

  // const {
  //   data: sub_exams_data,
  //   loading: sub_exams_loading,
  //   error: sub_exams_error,
  // } = useSubscription(SUB_GET_EXAM, {
  //   variables: { id: eid },
  // });

  // fetch exam
  const fetchExam = React.useCallback(async () => {
    setExamLoading(true);
    try {
      const { data: res } = await axios.get(`/v1/classroom/exam/${eid}`);
      setExam(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load exam");
    }
    setExamLoading(false);
  }, [eid]);
  
  React.useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  useSocket("exam.updated", (payload) => {
    if (payload.data.eid === eid || payload.data.cid === cid) {
      fetchExam();
    }
  });

  // const {
  //   data: sub_my_submission_data,
  //   loading: sub_my_submission_loading,
  //   error: sub_my_submission_error,
  // } = useSubscription(SUB_GET_MY_SUBMISSIONS, {
  //   variables: { uid: user.sub, eid: eid },
  // });

  // fetch my submissions
  const fetchMySubmissions = React.useCallback(async () => {
    setMySubmissionsLoading(true);
    try {
      const { data: res } = await axios.get(`/v1/classroom/exam/${eid}/${userInfo.id}/submissions`);
      setMySubmissions(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load my submissions");
    }
    setMySubmissionsLoading(false);
  }, [eid]);
  
  React.useEffect(() => {
    fetchMySubmissions();
  }, [fetchMySubmissions]);

  useSocket("exam.updated", (payload) => {
    if (payload.data.eid === eid || payload.data.cid === cid) {
      fetchMySubmissions();
    }
  });

  // const {
  //   data: sub_list_submissions_data,
  //   loading: sub_list_submissions_loading,
  //   error: sub_list_submissions_error,
  // } = useSubscription(SUB_LIST_SUBMISSIONS, {
  //   variables: { eid: eid },
  // });

  // fetch list submissions
  const fetchListSubmissions = React.useCallback(async () => {
    setListSubmissionsLoading(true);
    try {
      const { data: res } = await axios.get(`/v1/classroom/exam/${eid}/submissions`);
      setListSubmissions(res.data);
    } catch (err) {
      // setError(err?.response?.data?.message || "Failed to load list submissions");
    }
    setListSubmissionsLoading(false);
  }, [eid]);
  
  React.useEffect(() => {
    fetchListSubmissions();
  }, [fetchListSubmissions]);

  useSocket("exam.updated", (payload) => {
    if (payload.data.eid === eid || payload.data.cid === cid) {
      fetchListSubmissions();
    }
  });

  const currentUser = classroom?.classroom_relation.find(
    (cr) => cr.user.id === userInfo.id
  );

  const handleDeleteExam = async () => {
    setDeleteLoading(true);
    try {
      // await deleteExam({
      //   variables: {
      //     eid: eid,
      //   },
      // });
      const { data: res } = await axios.delete(`/v1/classroom/exam/${eid}`);
      if (res.status === 'success') {
        setSuccess(res.message);
        router.push(`/classroom/${cid}/exams`);
      } else {
        setError(res.message);
      }
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
      if (currentUser?.role === "parent") {
        if (mySubmissions?.length !== 0) {
          router.push(
            `/classroom/${cid}/exam/${eid}/start/${mySubmissions[0].id}`
          );
        } else {
          // const newSubmission = await addSubmissionEntry({
          //   variables: {
          //     eid: eid,
          //     status: "draft",
          //   },
          // });
          const res = await axios.post(`/v1/classroom/exam/submission/create`, {
            exam_id: eid,
            status: "draft",
          });
          router.push(
            `/classroom/${cid}/exam/${eid}/start/${res.data.id}`
          );
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
    if (currentUser?.role === "parent") {
      router.push(
        `/classroom/${cid}/exam/${eid}/submission/${mySubmissions[0].id}`
      );
    }
    setStarting(false);
  };

  // caluclate submission status
  React.useEffect(() => {
    if (
      !classroomLoading &&
      !examLoading &&
      !mySubmissionsLoading &&
      !listSubmissionsLoading
    ) {
      const start_time = moment(exam?.start_once).add(
        exam?.duration,
        "minutes"
      );

      if (currentUser?.role === "parent") {
        if (mySubmissions?.length !== 0) {
          const duration_time = moment(
            mySubmissions[0].created_at
          ).add(exam?.duration, "minutes");
          if (mySubmissions[0].status === "draft") {
            if (exam?.start_once) {
              if (start_time.isAfter(moment())) {
                setSubmissionStatus("STARTED");
              } else {
                setSubmissionStatus("FINISHED");
              }
            } else if (exam?.duration !== 0) {
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
          if (exam?.start_once) {
            if (start_time.isBefore(moment())) {
              setSubmissionStatus("ENDED");
            } else {
              setSubmissionStatus("SCEDULED");
            }
          } else {
            setSubmissionStatus("NOT STARTED");
          }
        }
      }
    }
  }, [
    classroomLoading,
    examLoading,
    mySubmissionsLoading,
    listSubmissionsLoading,
    currentUser,
    classroom,
    exam,
    mySubmissions,
    listSubmissions,
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
    if (listSubmissions.length > 0) {
      if (currentUser?.role === "teacher" || currentUser?.role === "owner") {
        listSubmissions.map((submission) => {
          if (submission.status !== "draft") {
            subs.push(submission);
          } else if (exam?.duration !== 0) {
            if (
              exam?.start_once &&
              moment(exam?.start_once)
                .add(exam?.duration, "minutes")
                .isBefore(moment())
            ) {
              subs.push(submission);
            } else if (
              !exam?.start_once &&
              moment(submission.created_at)
                .add(exam?.duration, "minutes")
                .isBefore(moment())
            ) {
              subs.push(submission);
            }
          }
        });
      }
    }
    setSubmissions(subs);
  }, [listSubmissions, currentUser, exam]);

  if (
    !classroomLoading &&
    !examLoading &&
    !mySubmissionsLoading &&
    !listSubmissionsLoading
  ) {
    // if not found
    if (!classroom && !exam) {
      return <NotFoundPage />;
    }

    // if exam is not for everyone and current user is not in the audience
    if (
      currentUser?.role === "parent" &&
      !exam?.audience.includes("*") &&
      !exam?.audience.includes(currentUser?.user.id)
    ) {
      return <NotFoundPage />;
    }

    // if draft
    if (
      exam?.status === "draft" &&
      currentUser?.role === "parent"
    ) {
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
      <ClassroomLayout
        id={cid}
        loading={classroomLoading || examLoading}
        classroom={classroom}
      >
        {success && (
          <div className="mb-4">
            <Alert color="success" title={success} />
          </div>
        )}
        <div className="flex flex-col gap-4">
          {d_error && (
            <div className="mb-4">
              <Alert
                color="danger"
                title="Something went wrong!"
                description={d_error.message}
              />
            </div>
          )}

          <h1 className="text-lg md:text-xl xl:text-2xl  p-5 bg-content2 font-bold rounded-xl">
            {exam?.title}
          </h1>
          <div className="flex flex-col xl:flex-row gap-4 max-w-full w-full">
            <div className="flex-auto flex flex-col overflow-x-auto">
              <div className="flex-auto px-10 py-4 bg-content2 rounded-xl h-full overflow-x-auto">
                <article className="prose max-w-none prose-lg prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-md prose-ul:list-disc prose-ol:list-decimal prose-table:border-collapse prose-table:border prose-table:border-gray-300 prose-th:border prose-th:p-2 prose-th:bg-gray-100 prose-td:border prose-td:p-2 prose-td:text-gray-700 prose-strong:text-gray-800 dark:prose-headings:text-gray-100 dark:prose-p:text-gray-300 dark:prose-a:text-blue-400 dark:prose-blockquote:border-gray-600 dark:prose-th:bg-gray-800 dark:prose-td:text-gray-300 dark:prose-table:border-gray-600 dark:prose-strong:text-gray-100">
                  <div
                    dangerouslySetInnerHTML={{
                      // __html: xss(exam?.content),
                      // __html: DOMPurify.sanitize(exam?.content),
                      __html: exam?.content,
                    }}
                  ></div>
                </article>
              </div>
            </div>
            <div className="flex-initial flex flex-col gap-4">
              <div className="p-5 bg-content2 w-full xl:w-72 rounded-xl">
                <h1 className="text-xl font-bold mb-2">Author</h1>

                <User
                  avatarProps={{
                    src: exam?.owner?.avatar.url,
                    alt: exam?.owner?.name,
                  }}
                  name={exam?.owner?.name}
                  description={exam?.owner?.email}
                />
              </div>

              <div className="p-5 bg-content2 w-full xl:w-72 rounded-xl">
                <h2 className="text-sm">
                  Status:{" "}
                  <span className="font-semibold">
                    {exam?.status.toUpperCase()}
                  </span>
                </h2>
                <h2 className="text-sm">
                  Last Updated:{" "}
                  <span className="font-semibold">
                    {moment(exam?.updated_at).fromNow()}
                  </span>
                </h2>
                {exam?.start_once !== null && (
                  <h2 className="text-sm text-danger-500 dark:text-danger-400">
                    Starts on:{" "}
                    <span className="font-semibold">
                      {moment(exam?.start_once).format(
                        "MMM DD, YYYY hh:mm A"
                      )}
                    </span>
                  </h2>
                )}

                {exam?.duration !== 0 &&
                  exam?.duration !== null && (
                    <h2 className="text-sm">
                      Exam Duration:{" "}
                      <span className="font-semibold">
                        {exam?.duration} minutes
                      </span>
                    </h2>
                  )}

                {currentUser?.role === "parent" && (
                  <h2 className="text-sm">
                    Submission Status:{" "}
                    <span className="font-semibold">{submissionStatus}</span>
                  </h2>
                )}
              </div>
              {/* if current user is the parent */}
              {currentUser?.role === "parent" && (
                <div className="p-5 bg-content2 w-full xl:w-72 rounded-xl">
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

                  {/* if scheduled */}
                  {submissionStatus === "SCEDULED" && (
                    <p className="text-sm text-center pt-1">
                      <span className="text-danger-500 dark:text-danger-400 italic text-xs font-medium">
                        Exam is scheduled to start at <br />
                        {moment(exam?.start_once).format(
                          "MMM DD, YYYY hh:mm A"
                        )}{" "}
                        <br />
                        Please wait for the exam to start.
                      </span>
                    </p>
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
              {(currentUser?.role === "owner" ||
                currentUser?.role === "teacher") && (
                <div className="p-5 bg-content2 w-full xl:w-72 rounded-xl">
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

          {currentUser?.role !== "parent" && (
            <div className="mt-16 pt-10 border-t-2 border-gray-200 dark:border-gray-700 border-dotted">
              <h1 className="text-2xl font-bold font-exo  text-gray-700 dark:text-gray-200">
                Student Submissions
              </h1>
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
                              src: submission.user.avatar.url,
                            }}
                            description={
                              <h4 className="text-sm text-gray-500 dark:text-gray-400">
                                {submission.user.email}
                              </h4>
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

                        <TableCell>
                          {moment(submission.updated_at).fromNow()}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/classroom/${cid}/exam/${eid}/evaluate/${submission.id}`}
                          >
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
                              src: submission.submitter.avatar.url,
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
