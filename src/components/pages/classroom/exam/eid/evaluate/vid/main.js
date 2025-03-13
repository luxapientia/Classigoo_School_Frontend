"use client";
import xss from "xss";
import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import moment, { duration } from "moment";
import { FileUploader } from "react-drag-drop-files";
import { Button, Alert, CheckboxGroup, Checkbox, Radio, RadioGroup, Input, Textarea } from "@heroui/react";
import { GET_EXAM_SUBMISSION } from "@graphql/queries";
import { UPDATE_EXAM_SUBMISSION_MARKINGS } from "@graphql/mutations";
import { SUB_GET_CLASSROOM, SUB_GET_EXAM } from "@graphql/subscriptions";
import { useSubscription, useMutation, useQuery } from "@apollo/client";
import Loading from "@components/common/loading";
import NotFoundPage from "@app/not-found";
import Link from "next/link";

export default function ExamEvaluaterMainComponent({ cid, eid, vid: sid, user }) {
  const router = useRouter();
  const imageTypes = ["png", "jpg", "jpeg", "heic", "webp"];

  const [questions, setQuestions] = React.useState([]);
  const [answers, setAnswers] = React.useState([]);
  const [markings, setMarkings] = React.useState([]);

  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(null);
  const [autoUpdate, setAutoUpdate] = React.useState(false);
  const [autoUpdateError, setAutoUpdateError] = React.useState(null);
  const [autoUpdateSuccess, setAutoUpdateSuccess] = React.useState(null);
  const [autoUpdateLoading, setAutoUpdateLoading] = React.useState(false);

  const [updateSubmission] = useMutation(UPDATE_EXAM_SUBMISSION_MARKINGS);

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

  // handle submit
  const handleSave = async () => {
    setSubmitting("evaluating");
    try {
      await updateSubmission({
        variables: {
          sid: sid,
          markings: markings,
          status: "evaluating",
        },
      });
      setSuccess("Evaluation saved successfully!");
    } catch (err) {
      setError("Failed to save evaluation! Check if you have awarded valid points to all questions.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting("published");
    try {
      // check if all questions are marked but rmember 0 is a valid marking
      const allMarked = markings.every((m) => m.marking !== null);
      if (!allMarked) {
        setError("Please award points to all questions!");
        return;
      }

      const totalPointsAwarded = markings.reduce((acc, curr) => acc + curr.marking, 0);
      const totalPoints = questions.reduce((acc, curr) => acc + curr.points, 0);
      if (totalPointsAwarded > totalPoints) {
        setError("Total points awarded exceeds total question points! Please correct the points.");
        return;
      }

      await updateSubmission({
        variables: {
          sid: sid,
          markings: markings,
          status: "published",
        },
      });

      setSuccess("Evaluation published successfully!");
      router.push(`/classroom/${cid}/exam/${eid}/submission/${sid}`);
    } catch (err) {
      setError("Failed to publish evaluation!");
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (!submission_loading && !exam_loading && !sub_loading) {
      if (submission_data?.exam_submissions_by_pk?.answers) {
        setAnswers(submission_data.exam_submissions_by_pk.answers);
      }

      if (exam_data?.exams_by_pk?.questions) {
        setQuestions(exam_data.exams_by_pk.questions);
      }

      if (submission_data?.exam_submissions_by_pk?.markings) {
        let mrking = [];
        // check for each question if making is already there if not for objective auto evaluate marking by checking the answer
        exam_data.exams_by_pk.questions.forEach((q) => {
          let marking = submission_data?.exam_submissions_by_pk.markings?.find((m) => m.question_id === q.id);
          if (marking) {
            mrking.push(marking);
          } else {
            if (q.question_type === "objective") {
              if (q.answer_type === "single") {
                let answer = submission_data?.exam_submissions_by_pk.answers?.find(
                  (a) => a.question_id === q.id
                )?.answer;

                let fullMark = q.answer === answer;
                let marking = fullMark ? q.points : 0;

                mrking.push({ question_id: q.id, marking: marking, notes: "" });
              }
              if (q.answer_type === "multiple") {
                let answer = submission_data?.exam_submissions_by_pk.answers?.find(
                  (a) => a.question_id === q.id
                )?.answer;
                // check if this answer is correct by matching with the options array with the answer array
                let fullMark = true;
                answer.forEach((ans) => {
                  if (!q.answer.includes(ans)) {
                    fullMark = false;
                  }
                });
                let marking = fullMark ? q.points : 0;
                mrking.push({ question_id: q.id, marking: marking, notes: "" });
              }
            } else {
              mrking.push({ question_id: q.id, marking: 0, notes: "" });
            }
          }
        });
        setMarkings(mrking);
      }
    }
  }, [submission_data, exam_data, sub_data, submission_loading, exam_loading, sub_loading]);

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
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // React.useEffect(() => {
  //   if (ended) {
  //     handleSubmit("submitted");
  //   }
  // }, [ended]);

  React.useEffect(() => {
    if (autoUpdate) {
      setAutoUpdateLoading(true);
      try {
        updateSubmission({
          variables: {
            sid: sid,
            status: "evaluating",
            markings: markings,
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

  React.useEffect(() => {
    if (markings.length > 0) {
      setAutoUpdate(true);
    }
  }, [markings]);

  // current user
  const currentUser = sub_data?.classrooms_by_pk?.classroom_relation.find((cr) => cr.user.id === user.sub);

  if (sub_loading || submission_loading || exam_loading) return <Loading />;
  // not found page
  if (sub_data?.classrooms_by_pk === null) return <NotFoundPage />;
  if (exam_data?.exams_by_pk === null) return <NotFoundPage />;
  if (submission_data?.exam_submissions_by_pk === null) return <NotFoundPage />;

  // if student is not allowed to evaluate
  if (currentUser.role !== "teacher" && currentUser.role !== "owner") {
    return <NotFoundPage />;
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
            <h1 className="text-2xl font-bold text-center">{exam_data.exams_by_pk.title}</h1>
          </div>
        </div>

        <div className="max-w-[calc(100%_-_20px)] w-[750px] mx-auto grid grid-rows-1 gap-5 mb-[30px] md:mb-[100px] relative">
          <div>
            {error && (
              <Alert
                className="my-5"
                color="danger"
                title={"Something went wrong!"}
                variant={"faded"}
                description={error}
              />
            )}
            {success && (
              <Alert className="my-5" color="success" title={"Success!"} variant={"faded"} description={success} />
            )}
          </div>
          {questions.length !== 0 &&
            questions.map((q, index) => {
              const ans = answers.find((a) => a.question_id === q.id)?.answer;

              if (q.question_type === "objective") {
                if (q.answer_type === "single") {
                  return (
                    <div key={q.id} className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl relative">
                      <div className="absolute top-1.5 right-1.5 bg-gray-200 dark:bg-neutral-700 rounded-lg text-sm font-medium px-3 py-1">
                        {q.points} Points
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-initial flex justify-center items-center">
                          <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex justify-center items-center py-2 px-1">
                            <span className="font-bold text-gray-700 dark:text-gray-200">#{index + 1}</span>
                          </div>
                        </div>
                        <div
                          className="flex-auto rounded-lg p-4 text-lg"
                          dangerouslySetInnerHTML={{ __html: xss(q.question) }}
                        ></div>
                      </div>
                      <div className="px-5">
                        <RadioGroup name={q.id} orientation="vertical" defaultValue={ans} isDisabled isReadOnly>
                          {q.options.map((option) => (
                            <Radio key={option} value={option} className="text-lg">
                              {option}
                            </Radio>
                          ))}
                        </RadioGroup>
                      </div>
                      <hr />
                      <div>
                        <p className="text-sm font-medium">
                          Correct Answer: <span className="font-bold">{q?.answer}</span>
                        </p>
                      </div>
                      <div>
                        <Input
                          variant="outline"
                          type="number"
                          name={q.id}
                          label="Point Awarded"
                          isReadOnly
                          isDisabled
                          value={markings.find((m) => m.question_id === q.id)?.marking}
                        />

                        <Textarea
                          className="mt-4"
                          placeholder="Type your notes here..."
                          label="Additional Notes"
                          value={markings.find((m) => m.question_id === q.id)?.notes}
                          onChange={(e) => {
                            const allMarkingsExceptCurrent = markings.filter((m) => m.question_id !== q.id);
                            setMarkings([
                              ...allMarkingsExceptCurrent,
                              {
                                question_id: q.id,
                                marking: markings.find((m) => m.question_id === q.id)?.marking,
                                notes: e.target.value,
                              },
                            ]);
                          }}
                        />
                      </div>
                    </div>
                  );
                }

                if (q.answer_type === "multiple") {
                  return (
                    <div key={q.id} className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl relative">
                      <div className="absolute top-1.5 right-1.5 bg-gray-200 dark:bg-neutral-700 rounded-lg text-sm font-medium px-3 py-1">
                        {q.points} Points
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-initial flex justify-center items-center">
                          <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex justify-center items-center py-2 px-1">
                            <span className="font-bold text-gray-700 dark:text-gray-200">#{index + 1}</span>
                          </div>
                        </div>
                        <div
                          className="flex-auto rounded-lg p-4 text-lg"
                          dangerouslySetInnerHTML={{ __html: xss(q.question) }}
                        ></div>
                      </div>
                      <div className="px-5">
                        <CheckboxGroup
                          name={q.id}
                          defaultValue={answers?.find((a) => a.question_id === q.id)?.answer || []}
                          isReadOnly
                          isDisabled
                        >
                          {q.options.map((option) => (
                            <Checkbox
                              key={option}
                              value={option}
                              className="text-lg"
                              isSelected={(option) =>
                                answers.find((a) => a.question_id === q.id)?.answer?.includes(option)
                              }
                            >
                              {option}
                            </Checkbox>
                          ))}
                        </CheckboxGroup>
                      </div>
                      <hr />
                      <div>
                        <p className="text-sm font-medium">
                          Correct Answer(s): <span className="font-bold">{q?.answer?.join(", ")}</span>
                        </p>
                      </div>
                      <div>
                        <Input
                          variant="outline"
                          type="number"
                          name={q.id}
                          label="Point Awarded"
                          isReadOnly
                          isDisabled
                          value={markings.find((m) => m.question_id === q.id)?.marking}
                        />

                        <Textarea
                          className="mt-4"
                          placeholder="Type your notes here..."
                          label="Additional Notes"
                          value={markings.find((m) => m.question_id === q.id)?.notes}
                          onChange={(e) => {
                            const allMarkingsExceptCurrent = markings.filter((m) => m.question_id !== q.id);
                            setMarkings([
                              ...allMarkingsExceptCurrent,
                              {
                                question_id: q.id,
                                marking: markings.find((m) => m.question_id === q.id)?.marking,
                                notes: e.target.value,
                              },
                            ]);
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              }
              if (q.question_type === "subjective") {
                if (q.answer_type === "text") {
                  return (
                    <div key={q.id} className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl relative">
                      <div className="absolute top-1.5 right-1.5 bg-gray-200 dark:bg-neutral-700 rounded-lg text-sm font-medium px-3 py-1">
                        {q.points} Points
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-initial flex justify-center items-center">
                          <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex justify-center items-center py-2 px-1">
                            <span className="font-bold text-gray-700 dark:text-gray-200">#{index + 1}</span>
                          </div>
                        </div>
                        <div
                          className="flex-auto rounded-lg p-4 text-lg"
                          dangerouslySetInnerHTML={{ __html: xss(q.question) }}
                        ></div>
                      </div>
                      <div className="px-5">
                        <Textarea
                          name={q.id}
                          placeholder="Type your answer here..."
                          value={answers.find((a) => a.question_id === q.id)?.answer}
                          isReadOnly
                          isDisabled
                          className="bg-white dark:bg-gray-700"
                        />
                      </div>
                      <hr />
                      <div>
                        <Input
                          variant="outline"
                          type="number"
                          name={q.id}
                          label="Point Awarded"
                          value={markings.find((m) => m.question_id === q.id)?.marking}
                          onChange={(e) => {
                            const allMarkingsExceptCurrent = markings.filter((m) => m.question_id !== q.id);
                            setMarkings([
                              ...allMarkingsExceptCurrent,
                              {
                                question_id: q.id,
                                marking: e.target.value,
                                notes: markings.find((m) => m.question_id === q.id)?.notes,
                              },
                            ]);
                          }}
                        />

                        <Textarea
                          className="mt-4"
                          placeholder="Type your notes here..."
                          label="Additional Notes"
                          value={markings.find((m) => m.question_id === q.id)?.notes}
                          onChange={(e) => {
                            const allMarkingsExceptCurrent = markings.filter((m) => m.question_id !== q.id);
                            setMarkings([
                              ...allMarkingsExceptCurrent,
                              {
                                question_id: q.id,
                                marking: markings.find((m) => m.question_id === q.id)?.marking,
                                notes: e.target.value,
                              },
                            ]);
                          }}
                        />
                      </div>
                    </div>
                  );
                }
                if (q.answer_type === "image") {
                  return (
                    <div key={q.id} className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl relative">
                      <div className="absolute top-1.5 right-1.5 bg-gray-200 dark:bg-neutral-700 rounded-lg text-sm font-medium px-3 py-1">
                        {q.points} Points
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-initial flex justify-center items-center">
                          <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex justify-center items-center py-2 px-1">
                            <span className="font-bold text-gray-700 dark:text-gray-200">#{index + 1}</span>
                          </div>
                        </div>
                        <div
                          className="flex-auto rounded-lg p-4 text-lg"
                          dangerouslySetInnerHTML={{ __html: xss(q.question) }}
                        ></div>
                      </div>
                      <div className="px-5">
                        <div className="py-5">
                          {answers.find((a) => a.question_id === q.id) &&
                            answers.find((a) => a.question_id === q.id)?.answer?.length > 0 && (
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
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                        </div>
                      </div>
                      <hr />
                      <div>
                        <Input
                          variant="outline"
                          type="number"
                          name={q.id}
                          label="Point Awarded"
                          value={markings.find((m) => m.question_id === q.id)?.marking}
                          onChange={(e) => {
                            const allMarkingsExceptCurrent = markings.filter((m) => m.question_id !== q.id);
                            setMarkings([
                              ...allMarkingsExceptCurrent,
                              {
                                question_id: q.id,
                                marking: e.target.value,
                                notes: markings.find((m) => m.question_id === q.id)?.notes,
                              },
                            ]);
                          }}
                        />

                        <Textarea
                          className="mt-4"
                          placeholder="Type your notes here..."
                          label="Additional Notes"
                          value={markings.find((m) => m.question_id === q.id)?.notes}
                          onChange={(e) => {
                            const allMarkingsExceptCurrent = markings.filter((m) => m.question_id !== q.id);
                            setMarkings([
                              ...allMarkingsExceptCurrent,
                              {
                                question_id: q.id,
                                marking: markings.find((m) => m.question_id === q.id)?.marking,
                                notes: e.target.value,
                              },
                            ]);
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              }
            })}

          {/* action buttons */}
          <div className="md:flex md:justify-between gap-4 md:fixed bottom-4 bg-black/15 dark:bg-white/20 backdrop-blur-lg z-10 dark:bg-gray-700 p-3 w-full md:w-[inherit] md:max-w-[calc(100vw_-_360px)] rounded-full">
            <div className="flex-auto md:grid content-center hidden"></div>
            <div className="flex-initial grid justify-items-end content-center">
              <div className="flex gap-2 md:justify-end w-full">
                <Button
                  variant="text"
                  className="w-full md:w-auto bg-default-foreground text-background rounded-full h-9 text-xs"
                  onPress={() => {
                    handleSave();
                  }}
                  isLoading={submitting === "evaluating"}
                  isDisabled={submitting === "published"}
                >
                  Save
                </Button>

                <Button
                  variant="text"
                  className="w-full md:w-auto bg-danger text-background rounded-full h-9 text-xs"
                  onPress={() => {
                    handleSubmit();
                  }}
                  isLoading={submitting === "published"}
                  isDisabled={submitting === "evaluating"}
                >
                  Publish Result
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
