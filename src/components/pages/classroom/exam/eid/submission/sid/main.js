"use client";
import xss from "xss";
import axios from "axios";
import React from "react";
import cn from "classnames";
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

export default function ExamSubmissionSeeMainComponent({ cid, eid, sid, user }) {
  const router = useRouter();
  const imageTypes = ["png", "jpg", "jpeg", "heic", "webp"];

  const [questions, setQuestions] = React.useState([]);
  const [answers, setAnswers] = React.useState([]);
  const [markings, setMarkings] = React.useState([]);
  const [totalMarks, setTotalMarks] = React.useState(0);
  const [receivedMarks, setReceivedMarks] = React.useState(0);

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

  React.useEffect(() => {
    if (exam_data?.exams_by_pk?.questions) {
      setQuestions(exam_data.exams_by_pk.questions);
    }

    if (submission_data?.exam_submissions_by_pk?.answers) {
      setAnswers(submission_data.exam_submissions_by_pk.answers);
    }

    if (submission_data?.exam_submissions_by_pk?.markings) {
      setMarkings(submission_data.exam_submissions_by_pk.markings);
    }

    if (exam_data?.exams_by_pk?.questions && submission_data?.exam_submissions_by_pk?.answers) {
      let total = 0;
      let received = 0;
      exam_data.exams_by_pk.questions.forEach((q) => {
        total += parseInt(q.points);
        const marking = submission_data.exam_submissions_by_pk.markings.find((m) => m.question_id === q.id);
        if (marking) {
          received += parseInt(marking.marking);
        }
      });
      setTotalMarks(total);
      setReceivedMarks(received);
    }
  }, [submission_data, exam_data]);

  // current user
  const currentUser = sub_data?.classrooms_by_pk?.classroom_relation.find((cr) => cr.user.id === user.sub);

  if (sub_loading || submission_loading || exam_loading) return <Loading />;
  // not found page
  if (sub_data?.classrooms_by_pk === null) return <NotFoundPage />;
  if (exam_data?.exams_by_pk === null) return <NotFoundPage />;
  if (submission_data?.exam_submissions_by_pk === null) return <NotFoundPage />;

  const can_see =
    (currentUser?.role === "student" && submission_data?.exam_submissions_by_pk?.status === "published") ||
    currentUser?.role !== "student";

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-center">{exam_data.exams_by_pk.title}</h1>
            {can_see && (
              <div>
                <p className="text-lg font-medium text-center">
                  Marks Obtained: <span className="font-bold">{receivedMarks}</span> / {totalMarks}
                </p>
              </div>
            )}

            {(currentUser?.role === "teacher" || currentUser?.role === "owner") && (
              <div className="flex gap-4 justify-center">
                <Link href={`/classroom/${cid}/exam/${eid}/evaluation/${sid}`}>
                  <Button
                    variant="outline"
                    className="flex gap-2 items-center bg-black text-white dark:bg-gray-200 dark:text-gray-900"
                    disabled={submission_data.exam_submissions_by_pk.status !== "published"}
                  >
                    Re Evaluate
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-[calc(100vw-20px)] w-[750px] mx-auto grid grid-rows-1 gap-5 mb-[100px] relative">
          {questions.map((q, index) => {
            const ans = answers.find((a) => a.question_id === q.id)?.answer;
            const points = markings.find((m) => m.question_id === q.id)?.marking;

            if (q.question_type === "objective") {
              if (q.answer_type === "single") {
                return (
                  <div
                    key={q.id}
                    className={cn(
                      "flex flex-col gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl relative border-dotted",
                      {
                        "border-2 border-green-500": can_see && points == q.points,
                        "border-2 border-red-500": can_see && points == 0,
                        "border-2 border-yellow-500": can_see && (points < q.points) & (points > 0),
                      }
                    )}
                  >
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
                    {can_see && (
                      <>
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
                            value={markings.find((m) => m.question_id === q.id)?.marking}
                            isReadOnly
                            isDisabled
                          />

                          <Textarea
                            className="mt-4"
                            placeholder="Type your notes here..."
                            label="Additional Notes"
                            value={markings.find((m) => m.question_id === q.id)?.notes}
                            isReadOnly
                            isDisabled
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              }

              if (q.answer_type === "multiple") {
                return (
                  <div
                    key={q.id}
                    className={cn(
                      "flex flex-col gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl relative border-dotted",
                      {
                        "border-2 border-green-500": can_see && points == q.points,
                        "border-2 border-red-500": can_see && points == 0,
                        "border-2 border-yellow-500": can_see && (points < q.points) & (points > 0),
                      }
                    )}
                  >
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
                        defaultValue={[...answers.find((a) => a.question_id === q.id)?.answer]}
                        isReadOnly
                        isDisabled
                      >
                        {q.options.map((option) => (
                          <Checkbox
                            key={option}
                            value={option}
                            className="text-lg"
                            isSelected={(option) =>
                              answers.find((a) => a.question_id === q.id)?.answer.includes(option)
                            }
                          >
                            {option}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </div>
                    {can_see && (
                      <>
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
                            isReadOnly
                            isDisabled
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              }
            }
            if (q.question_type === "subjective") {
              console.log(`LK ${points} < ${q.points}`, points < q.points);
              if (q.answer_type === "text") {
                return (
                  <div
                    key={q.id}
                    className={cn(
                      "flex flex-col gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl relative border-dotted",
                      {
                        "border-2 border-green-500": can_see && points == q.points,
                        "border-2 border-red-500": can_see && points == 0,
                        "border-2 border-yellow-500": can_see && (points < q.points) & (points > 0),
                      }
                    )}
                  >
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
                    {can_see && (
                      <>
                        <hr />
                        <div>
                          <Input
                            variant="outline"
                            type="number"
                            name={q.id}
                            label="Point Awarded"
                            value={markings.find((m) => m.question_id === q.id)?.marking}
                            isReadOnly
                            isDisabled
                          />

                          <Textarea
                            className="mt-4"
                            placeholder="Type your notes here..."
                            label="Additional Notes"
                            value={markings.find((m) => m.question_id === q.id)?.notes}
                            isReadOnly
                            isDisabled
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              }
              if (q.answer_type === "image") {
                return (
                  <div
                    key={q.id}
                    className={cn(
                      "flex flex-col gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl relative border-dotted",
                      {
                        "border-2 border-green-500": can_see && points == q.points,
                        "border-2 border-red-500": can_see && points == 0,
                        "border-2 border-yellow-500": can_see && (points < q.points) & (points > 0),
                      }
                    )}
                  >
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
                    {can_see && (
                      <>
                        <hr />
                        <div>
                          <Input
                            variant="outline"
                            type="number"
                            name={q.id}
                            label="Point Awarded"
                            value={markings.find((m) => m.question_id === q.id)?.marking}
                            isReadOnly
                            isDisabled
                          />

                          <Textarea
                            className="mt-4"
                            placeholder="Type your notes here..."
                            label="Additional Notes"
                            value={markings.find((m) => m.question_id === q.id)?.notes}
                            isReadOnly
                            isDisabled
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              }
            }
          })}
        </div>
      </div>
    </>
  );
}
