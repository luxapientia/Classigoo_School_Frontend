"use client";
import xss from "xss";
import axios from "axios";
import React from "react";
import Link from "next/link";
import DOMPurify from "dompurify";
import { Icon } from "@iconify/react";
import NotFoundPage from "@app/not-found";
import moment, { duration } from "moment";
import { useRouter } from "next/navigation";
import Loading from "@components/common/loading";
import { FileUploader } from "react-drag-drop-files";
import { GET_EXAM_SUBMISSION } from "@graphql/queries";
import { UPDATE_MY_SUBMISSION } from "@graphql/mutations";
import { useSubscription, useMutation, useQuery } from "@apollo/client";
import {
  SUB_GET_CLASSROOM,
  SUB_GET_EXAM,
  SUB_GET_SUBMISSION,
} from "@graphql/subscriptions";
import {
  Button,
  Alert,
  CheckboxGroup,
  Checkbox,
  Radio,
  RadioGroup,
  Input,
  Textarea,
} from "@heroui/react";

export default function ExamTakerMainComponent({ cid, eid, sid, user }) {
  const router = useRouter();
  const imageTypes = ["png", "jpg", "jpeg", "heic", "webp"];

  const [questions, setQuestions] = React.useState([]);
  const [answers, setAnswers] = React.useState([]);
  const [ended, setEnded] = React.useState(false);
  const [timer, setTimer] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(null);
  const [autoUpdate, setAutoUpdate] = React.useState(false);
  const [autoUpdateError, setAutoUpdateError] = React.useState(null);
  const [autoUpdateSuccess, setAutoUpdateSuccess] = React.useState(null);
  const [autoUpdateLoading, setAutoUpdateLoading] = React.useState(false);

  // files
  const [tempFile, setTempFile] = React.useState(null);
  const [fileError, setFileError] = React.useState(null);
  const [filePicker, setFilePicker] = React.useState(false);
  const [tempFilePreview, setTempFilePreview] = React.useState(null);

  const [updateSubmission] = useMutation(UPDATE_MY_SUBMISSION);

  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_GET_CLASSROOM, {
    variables: { id: cid },
  });

  const {
    data: exam_data,
    loading: exam_loading,
    error: exam_error,
  } = useSubscription(SUB_GET_EXAM, {
    variables: { id: eid },
  });

  const {
    data: submission_data,
    loading: submission_loading,
    error: submission_error,
  } = useQuery(GET_EXAM_SUBMISSION, {
    variables: { sid },
  });

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
    setFileError("");
    try {
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
        // add the file to the answer
        const existingAnswer = answers.find(
          (a) => a.question_id === filePicker
        );
        if (existingAnswer) {
          const currentAnswer = [
            ...existingAnswer.answer,
            response.data.data.location,
          ];
          const newAnswers = answers.filter(
            (a) => a.question_id !== filePicker
          );
          newAnswers.push({ question_id: filePicker, answer: currentAnswer });

          setAnswers(newAnswers);
        } else {
          const newAnswers = answers.filter(
            (a) => a.question_id !== filePicker
          );
          newAnswers.push({
            question_id: filePicker,
            answer: [response.data.data.location],
          });
          setAnswers(newAnswers);
        }

        setTempFile(null);
        setTempFilePreview(null);
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
  const handleDeleteFile = async (locations, quid) => {
    // remove file from the server
    setDeleting(true);
    try {
      const response = await axios.post("/api/proxy/upload/posts/delete", {
        files: locations,
      });

      if (response.data.status === "success") {
        // remove the specific files from the state by the way locations are array of file locations
        // existing answer
        const existingAnswer = answers.find((a) => a.question_id === quid);
        if (existingAnswer) {
          const filteredAnswers = answers.filter((a) => a.question_id !== quid);
          const oldAnswerFiles = [...existingAnswer.answer];

          // for each file location remove it from oldAnswerFilesArray
          locations.forEach((location) => {
            const index = oldAnswerFiles.indexOf(location);
            if (index > -1) {
              oldAnswerFiles.splice(index, 1);
            }
          });

          console.log(oldAnswerFiles);

          filteredAnswers.push({
            question_id: quid,
            answer: oldAnswerFiles || [],
          });

          setAnswers(filteredAnswers);
          setAutoUpdate(true);
        }
      }

      if (response.data.status === "error") {
        setFileError(response.data.message);
      } else {
        // alert("File deleted successfully.");
        // setFileSuccess("File deleted successfully.");
      }
    } catch (err) {
      // console.log(err);
      setFileError(err.message);
    }
    setDeleting(false);
  };

  // handle submit
  const handleSubmit = async (status) => {
    setSubmitting(true);
    try {
      await updateSubmission({
        variables: {
          sid: sid,
          answers: answers,
          status: status,
        },
      });
      setAutoUpdateSuccess(true);
      if (status === "submitted") {
        router.push(`/classroom/${cid}/exam/${eid}/submission/${sid}`);
      }
    } catch (err) {
      setAutoUpdateError(true);
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (sub_loading || exam_loading || submission_loading) return;
    if (sub_data?.classrooms_by_pk === null) return;
    if (exam_data?.exams_by_pk === null) return;
    if (submission_data?.exam_submissions_by_pk === null) return;

    const exam = exam_data.exams_by_pk;
    const submission = submission_data.exam_submissions_by_pk;

    // if (submission?.status === "submitted") {
    //   setEnded(true);
    // }

    if (exam?.duration) {
      setTimer(true);
      if (
        exam.start_once &&
        !moment().isBefore(moment(exam.start_at).add(exam.duration, "minutes"))
      ) {
        setTimeLeft(
          moment(exam.start_at)
            .add(exam.duration, "minutes")
            .diff(moment(), "seconds")
        );
      } else {
        setTimeLeft(
          moment(submission.created_at)
            .add(exam.duration, "minutes")
            .diff(moment(), "seconds")
        );
      }
    }

    // const autoUpdate = setInterval(async () => {
    //   let status = timeLeft > 0 ? "draft" : "submitted";
    //   await handleSubmit(status);
    // }, 30000);

    // return () => clearInterval(autoUpdate);
  }, [sub_data, exam_data, submission_data]);

  React.useEffect(() => {
    if (timer && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        if (timeLeft <= 0) {
          if (exam_data.exams_by_pk.duration !== 0) {
            handleSubmit("submitted");
          }
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, timeLeft]);

  React.useEffect(() => {
    if (submission_data?.exam_submissions_by_pk?.answers) {
      setAnswers(submission_data.exam_submissions_by_pk.answers);
    }

    if (exam_data?.exams_by_pk?.questions) {
      setQuestions(exam_data.exams_by_pk.questions);
    }
  }, [submission_data, exam_data]);

  React.useEffect(() => {
    if (autoUpdateError) {
      const timer = setTimeout(() => {
        setAutoUpdateError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoUpdateError]);

  React.useEffect(() => {
    if (autoUpdateSuccess) {
      const timer = setTimeout(() => {
        setAutoUpdateSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoUpdateSuccess]);

  React.useEffect(() => {
    if (fileError) {
      const timer = setTimeout(() => {
        setFileError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [fileError]);

  // React.useEffect(() => {
  //   if (ended) {
  //     handleSubmit("submitted");
  //   }
  // }, [ended]);

  React.useEffect(() => {
    if (answers.length > 0) {
      const Timer = setTimeout(() => {
        setAutoUpdate(true);
      }, 10000);
      return () => clearTimeout(Timer);
    }
  }, [answers]);

  React.useEffect(() => {
    if (autoUpdate) {
      setAutoUpdateLoading(true);
      try {
        updateSubmission({
          variables: {
            sid: sid,
            answers: answers,
            status: "draft",
          },
        });
        setAutoUpdateSuccess(true);
      } catch (err) {
        setAutoUpdateError(true);
      } finally {
        setAutoUpdate(false);
        setAutoUpdateLoading(false);
      }
    }
  }, [autoUpdate]);

  if (sub_loading || submission_loading || exam_loading) return <Loading />;
  // not found page
  if (sub_data?.classrooms_by_pk === null) return <NotFoundPage />;
  if (exam_data?.exams_by_pk === null) return <NotFoundPage />;
  if (submission_data?.exam_submissions_by_pk === null) return <NotFoundPage />;

  // if already submitted then redirect to the submission page
  if (submission_data?.exam_submissions_by_pk?.status !== "draft") {
    router.push(`/classroom/${cid}/exam/${eid}/submission/${sid}`);
  }

  // if start once and the exam is not started yet
  if (
    exam_data.exams_by_pk.start_once &&
    !moment().isBefore(moment(exam_data.exams_by_pk.start_once))
  ) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <p className="text-2xl font-bold text-center">
          Exam has not started yet!
        </p>
      </div>
    );
  }

  // if exam started from start_once and exam+duration has passed current time
  if (exam_data.exams_by_pk.duration !== 0) {
    if (
      exam_data.exams_by_pk.start_once &&
      moment().isAfter(
        moment(exam_data.exams_by_pk.start_once).add(
          exam_data.exams_by_pk.duration,
          "minutes"
        )
      )
    ) {
      return (
        <div className="flex flex-col justify-center items-center h-[calc(100vh-100px)]">
          <p className="text-2xl font-bold text-center">Exam has ended!</p>

          {submission_data?.exam_submissions_by_pk !== null && (
            <div className="mt-5">
              <Link
                href={`/classroom/${cid}/exam/${eid}/submission/${sid}`}
                className="bg-default-foreground text-background rounded-full px-4 py-2"
              >
                View Submission
              </Link>
            </div>
          )}
        </div>
      );
    }
    // else if if only duration then start submission time + duration has passed current time and start_once is null
    else if (
      !exam_data.exams_by_pk.start_once &&
      moment().isAfter(
        moment(submission_data.exam_submissions_by_pk.created_at).add(
          exam_data.exams_by_pk.duration,
          "minutes"
        )
      )
    ) {
      return (
        <div className="flex flex-col justify-center items-center h-[calc(100vh-100px)]">
          <p className="text-2xl font-bold text-center">Exam has ended!</p>

          {submission_data?.exam_submissions_by_pk !== null && (
            <div className="mt-5">
              <Link
                href={`/classroom/${cid}/exam/${eid}/submission/${sid}`}
                className="bg-default-foreground text-background rounded-full px-4 py-2"
              >
                View Submission
              </Link>
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {autoUpdateError && (
          <div className="top-2 right-5 fixed z-50 w-fit">
            <p className="flex border border-dashed border-gray-500 rounded-lg p-2 bg-white dark:bg-gray-700 text-xs">
              <Icon icon="fluent:timer-20-regular" className="h-4 w-4" />
              Auto Save Failed!
            </p>
          </div>
        )}
        {autoUpdateSuccess && (
          <div className="top-2 right-5 fixed z-50 w-fit">
            <p className="flex border border-dashed border-gray-500 rounded-lg p-2 bg-white dark:bg-gray-700 text-xs">
              <Icon icon="fluent:timer-20-regular" className="h-4 w-4" />
              Auto Saved!
            </p>
          </div>
        )}

        {autoUpdateLoading && (
          <div className="top-2 right-5 fixed z-50 w-fit">
            <p className="flex border border-dashed border-gray-500 rounded-lg p-2 bg-white dark:bg-gray-700 text-xs">
              <Icon icon="fluent:timer-20-regular" className="h-4 w-4" />
              Auto saving...
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-center">
              {exam_data.exams_by_pk.title}
            </h1>
            {timer && (
              <>
                <p className="text-center">
                  <span>
                    Duration:{" "}
                    {duration(
                      exam_data.exams_by_pk.duration,
                      "minutes"
                    ).hours()}
                    h :{" "}
                    {duration(
                      exam_data.exams_by_pk.duration,
                      "minutes"
                    ).minutes()}
                    m
                  </span>
                </p>

                {timer > 0 && (
                  <div className="md:hidden grid justify-center items-center">
                    <p className="text-xs text-gray-500 font-exo px-3 py-2 border-2 rounded-lg border-dotted">
                      <span className="text-sm font-exo font-medium text-black dark:text-gray-200">
                        Time left: {duration(timeLeft, "seconds").hours()}h :{" "}
                        {duration(timeLeft, "seconds").minutes()}m :{" "}
                        {duration(timeLeft, "seconds").seconds()}s
                      </span>
                    </p>
                  </div>
                )}
                {timeLeft <= 0 && (
                  <div className=" justify-center items-center grid">
                    <p className="border-2 border-dashed border-gray-500 rounded-lg flex gap-2 px-2 py-1 w-fit justify-center items-center">
                      <Icon
                        icon="fluent:timer-20-regular"
                        className="h-6 w-6"
                      />
                      <span>Time's up!</span>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="max-w-[calc(100%_-_20px)] w-[750px] mx-auto grid grid-rows-1 gap-5 mb-[30px] md:mb-[100px] relative">
          {questions.map((q, index) => {
            if (q.question_type === "objective") {
              if (q.answer_type === "single") {
                return (
                  <div
                    key={q.id}
                    className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl relative"
                  >
                    <div className="absolute top-1.5 right-1.5 bg-gray-200 dark:bg-neutral-700 rounded-lg text-sm font-medium px-3 py-1">
                      {q.points} Points
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-initial flex justify-center items-center">
                        <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex justify-center items-center py-2 px-1">
                          <span className="font-bold text-gray-700 dark:text-gray-200">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="flex-auto rounded-lg p-4 text-lg">
                        <article
                          className="prose max-w-none prose-lg prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-md prose-ul:list-disc prose-ol:list-decimal prose-table:border-collapse prose-table:border prose-table:border-gray-300 prose-th:border prose-th:p-2 prose-th:bg-gray-100 prose-td:border prose-td:p-2 prose-td:text-gray-700 prose-strong:text-gray-800 dark:prose-headings:text-gray-100 dark:prose-p:text-gray-300 dark:prose-a:text-blue-400 dark:prose-blockquote:border-gray-600 dark:prose-th:bg-gray-800 dark:prose-td:text-gray-300 dark:prose-table:border-gray-600 dark:prose-strong:text-gray-100"
                          dangerouslySetInnerHTML={{
                            // __html: xss(q.question)
                            __html: DOMPurify.sanitize(q.question),
                          }}
                        ></article>
                      </div>
                    </div>
                    <div className="px-5">
                      <RadioGroup
                        name={q.id}
                        defaultValue={
                          answers.find((a) => a.question_id === q.id)?.answer ||
                          ""
                        }
                        orientation="vertical"
                        onChange={(e) => {
                          const newAnswers = answers.filter(
                            (a) => a.question_id !== q.id
                          );
                          newAnswers.push({
                            question_id: q.id,
                            answer: e.target.value,
                          });
                          setAnswers(newAnswers);
                        }}
                      >
                        {q.options.map((option) => (
                          <Radio
                            key={option}
                            value={option}
                            className="text-lg"
                          >
                            {option}
                          </Radio>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                );
              }

              if (q.answer_type === "multiple") {
                return (
                  <div
                    key={q.id}
                    className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl relative"
                  >
                    <div className="absolute top-1.5 right-1.5 bg-gray-200 dark:bg-neutral-700 rounded-lg text-sm font-medium px-3 py-1">
                      {q.points} Points
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-initial flex justify-center items-center">
                        <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex justify-center items-center py-2 px-1">
                          <span className="font-bold text-gray-700 dark:text-gray-200">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                      <div
                        className="flex-auto rounded-lg p-4 text-lg"
                        dangerouslySetInnerHTML={{
                          // __html: xss(q.question)
                          __html: DOMPurify.sanitize(q.question),
                        }}
                      ></div>
                    </div>
                    <div className="px-5">
                      <CheckboxGroup
                        name={q.id}
                        defaultValue={
                          answers?.find((a) => a.question_id === q.id)
                            ?.answer || []
                        }
                        onChange={(e) => {
                          console.log(e);
                          const newAnswers = answers.filter(
                            (a) => a.question_id !== q.id
                          );
                          newAnswers.push({
                            question_id: q.id,
                            answer: [...e],
                          });
                          setAnswers(newAnswers);
                        }}
                      >
                        {q.options.map((option) => (
                          <Checkbox
                            key={option}
                            value={option}
                            className="text-lg"
                            isSelected={(option) =>
                              answers
                                .find((a) => a.question_id === q.id)
                                ?.answer.includes(option)
                            }
                          >
                            {option}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </div>
                  </div>
                );
              }
            }
            if (q.question_type === "subjective") {
              if (q.answer_type === "text") {
                return (
                  <div
                    key={q.id}
                    className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl relative"
                  >
                    <div className="absolute top-1.5 right-1.5 bg-gray-200 dark:bg-neutral-700 rounded-lg text-sm font-medium px-3 py-1">
                      {q.points} Points
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-initial flex justify-center items-center">
                        <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex justify-center items-center py-2 px-1">
                          <span className="font-bold text-gray-700 dark:text-gray-200">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                      <div
                        className="flex-auto rounded-lg p-4 text-lg"
                        dangerouslySetInnerHTML={{
                          // __html: xss(q.question)
                          __html: DOMPurify.sanitize(q.question),
                        }}
                      ></div>
                    </div>
                    <div className="px-5">
                      <Textarea
                        name={q.id}
                        placeholder="Type your answer here..."
                        value={
                          answers.find((a) => a.question_id === q.id)?.answer
                        }
                        onChange={(e) => {
                          const newAnswers = answers.filter(
                            (a) => a.question_id !== q.id
                          );
                          newAnswers.push({
                            question_id: q.id,
                            answer: e.target.value,
                          });
                          setAnswers(newAnswers);
                        }}
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>
                );
              }
              if (q.answer_type === "image") {
                return (
                  <div
                    key={q.id}
                    className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl relative"
                  >
                    <div className="absolute top-1.5 right-1.5 bg-gray-200 dark:bg-neutral-700 rounded-lg text-sm font-medium px-3 py-1">
                      {q.points} Points
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-initial flex justify-center items-center">
                        <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex justify-center items-center py-2 px-1">
                          <span className="font-bold text-gray-700 dark:text-gray-200">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                      <div
                        className="flex-auto rounded-lg p-4 text-lg"
                        dangerouslySetInnerHTML={{
                          // __html: xss(q.question)
                          __html: DOMPurify.sanitize(q.question),
                        }}
                      ></div>
                    </div>
                    <div className="px-5">
                      <div className="py-5">
                        {answers.find((a) => a.question_id === q.id) &&
                          answers.find((a) => a.question_id === q.id)?.answer
                            ?.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                              {answers
                                .find((a) => a.question_id === q.id)
                                ?.answer?.map((answer, index) => (
                                  <div
                                    key={index}
                                    className="relative h-48 w-full rounded-lg bg-gray-200 dark:bg-gray-700"
                                    style={{
                                      backgroundSize: "cover",
                                      backgroundPosition: "center center",
                                      backgroundImage: `url(${process.env.CLASSROOM_CDN_URL}/${answer})`,
                                    }}
                                  >
                                    <div className="absolute top-0 right-0 flex gap-2 p-2">
                                      <Link
                                        href={`${process.env.CLASSROOM_CDN_URL}/${answer}`}
                                        target="_blank"
                                        className="p-0 w-7 h-7 bg-white dark:bg-gray-800 rounded-full grid justify-center items-center"
                                      >
                                        <Icon
                                          icon="solar:eye-bold-duotone"
                                          className="h-5 w-5 text-gray-600 dark:text-gray-200"
                                        />
                                      </Link>
                                      <Button
                                        className="p-0 w-7 h-7 bg-white rounded-full grid justify-center items-center"
                                        size="sm"
                                        variant="text"
                                        onPress={() =>
                                          handleDeleteFile([answer], q.id)
                                        }
                                        isDisabled={deleting}
                                        isIconOnly
                                      >
                                        {deleting ? (
                                          <Icon
                                            icon="eos-icons:three-dots-loading"
                                            className="h-5 w-5 text-gray-600 dark:text-gray-200"
                                          />
                                        ) : (
                                          <Icon
                                            icon="solar:trash-bin-trash-bold-duotone"
                                            className="h-5 w-5 text-gray-600 dark:text-gray-200"
                                          />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                      </div>
                      <Button
                        variant="text"
                        className="border-2 border-dotted w-full font-exo text-sm font-medium"
                        onClick={() => setFilePicker(q.id)}
                      >
                        Upload Image
                      </Button>
                    </div>
                  </div>
                );
              }
            }
          })}

          {/* action buttons */}
          <div className="md:flex md:justify-between gap-4 md:fixed bottom-4 bg-black/15 dark:bg-white/20 backdrop-blur-lg z-10 dark:bg-gray-700 p-3 w-full md:w-[inherit] md:max-w-[calc(100vw_-_360px)] rounded-full">
            <div className="flex-initial hidden md:grid content-center">
              {timer > 0 && (
                <p className="text-xs text-gray-500 font-exo">
                  <span className="text-sm font-exo font-medium text-black dark:text-gray-200">
                    Time left: {duration(timeLeft, "seconds").hours()}h :{" "}
                    {duration(timeLeft, "seconds").minutes()}m :{" "}
                    {duration(timeLeft, "seconds").seconds()}s
                  </span>
                </p>
              )}
            </div>
            <div className="flex-auto grid justify-items-end content-center">
              <div className="flex gap-2 justify-end w-full md:w-auto">
                <Button
                  variant="text"
                  className="w-full md:w-auto bg-default-foreground text-background rounded-full h-9 text-xs"
                  onPress={() => {
                    handleSubmit("draft");
                  }}
                  isLoading={submitting === "draft"}
                  isDisabled={submitting === "submitted"}
                >
                  Save
                </Button>

                <Button
                  variant="text"
                  className="w-full md:w-auto bg-danger text-background rounded-full h-9 text-xs"
                  onPress={() => {
                    handleSubmit("submitted");
                  }}
                  isLoading={submitting === "submitted"}
                  isDisabled={submitting === "draft"}
                >
                  Submit
                </Button>
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
                types={imageTypes}
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
                <p className="text-xs text-default-400">
                  <span className="text-danger-500">*</span>
                  Allowed File types: {imageTypes.join(", ")}
                </p>

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
