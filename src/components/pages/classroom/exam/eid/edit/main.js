"use client";
import axios from "@lib/axios";
import React from "react";
import moment from "moment";
import DOMPurify from "dompurify";
import { Icon } from "@iconify/react";
// import { useRouter } from "next/navigation";
import MemberSelector from "./member-selector";
import { useRouter } from "nextjs-toploader/app";
import Loading from "@components/common/loading";
import TinyEditor from "@components/common/editor";
import QuestionBuilder from "./question-builder";
import QuestionUpdater from "./question-updater";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Alert,
  DatePicker,
} from "@heroui/react";

import {
  now,
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";

import { useSocket } from "@hooks/useSocket";

// import { UPDATE_EXAM } from "@graphql/mutations";
// import { SUB_GET_EXAM } from "@graphql/subscriptions";
// import { SUB_GET_CLASSROOM } from "@graphql/subscriptions";
// import { useQuery, useMutation, useSubscription } from "@apollo/client";

import NotFoundPage from "@app/not-found";

export default function ExamUpdateMainComponent({ eid, cid: classId, userInfo }) {
  const router = useRouter();
  const editorRef = React.useRef(null);
  const [classroom, setClassroom] = React.useState(null);
  const [classroomLoading, setClassroomLoading] = React.useState(false);
  const [exam, setExam] = React.useState(null);
  const [examLoading, setExamLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("loading.....");
  const [questions, setQuestions] = React.useState([]);
  const [dStart, setDStart] = React.useState("no");
  const [startAt, setStartAt] = React.useState(now(getLocalTimeZone()));
  const [sDuration, setSDuration] = React.useState("no");
  const [duration, setDuration] = React.useState("0");
  // const [deadline, setDeadline] = React.useState(null);

  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const [audience, setAudience] = React.useState(["*"]);
  const [deleting, setDeleting] = React.useState(false);
  const [openPicker, setOpenPicker] = React.useState(false);

  const [openQBuilder, setOpenQBuilder] = React.useState(false);
  const [openQUpdater, setOpenQUpdater] = React.useState(false);

  // const {
  //   data: sub_data,
  //   loading: sub_loading,
  //   error: sub_error,
  // } = useSubscription(SUB_GET_CLASSROOM, {
  //   variables: { id: classId },
  // });

  // fetch classroom
  const fetchClassroom = React.useCallback(async () => {
    setClassroomLoading(true);
    try {
      const res = await axios.get(`/v1/classroom/${classId}`);
      setClassroom(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load classroom");
    }

    setClassroomLoading(false);
  }, [classId]);

  React.useEffect(() => {
    fetchClassroom();
  }, [fetchClassroom]);

  // useSocket("classroom.updated", (payload) => {
  //   if (payload.data.id === classId) {
  //     fetchClassroom();
  //   }
  // });

  // const {
  //   data: exam_data,
  //   loading: exam_loading,
  //   error: exam_error,
  // } = useSubscription(SUB_GET_EXAM, {
  //   variables: {
  //     id: eid,
  //   },
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

  // useSocket("exam.updated", (payload) => {
  //   if (payload.data.eid === eid || payload.data.cid === cid) {
  //     fetchExam();
  //   }
  // });

  // initiate mutations
  // const [updateExam] = useMutation(UPDATE_EXAM);

  // React.useEffect(() => {
  //   console.log(deadline);
  // }, [deadline]);

  // current user
  const currentUser = userInfo.id;
  const userRole = classroom?.classroom_relation.find(
    (m) => m.user.id === currentUser
  )?.role;

  // check if user is a student
  if (userRole === "student") return <NotFoundPage />;

  // // create exam
  const handleUpdateExam = async (status) => {
    setLoading(status);

    try {
      // remove null or '' from members
      const fixedAudience = audience.filter((a) => a !== null && a !== "");
      const fixedStartAt = startAt ? startAt.toAbsoluteString() : null;

      if (!title) {
        setError("Please enter a title for the exam.");
        setLoading(false);
        return;
      }

      if (!content) {
        setError("Please enter the exam details.");
        setLoading(false);
        return;
      }

      if (questions.length === 0) {
        setError("Please add questions to the exam.");
        setLoading(false);
        return;
      }

      // if (fixedAudience.length === 0) {
      //   setError("Please select the audience for the exam.");
      //   setLoading(false);
      //   return;
      // }

      if (dStart === "yes" && !startAt) {
        setError("Please enter the exam start date.");
        setLoading(false);
        return;
      }

      if (dStart === "yes" && moment(fixedStartAt).isBefore(moment())) {
        setError("Start date cannot be in the past.");
        setLoading(false);
        return;
      }

      if (sDuration === "yes" && !duration) {
        setError("Please enter the exam duration.");
        setLoading(false);
        return;
      }

      // const { data } = await updateExam({
      //   variables: {
      //     eid,
      //     title,
      //     content,
      //     cid: classId,
      //     status,
      //     questions,
      //     aud: fixedAudience,
      //     duration: sDuration === "yes" ? duration : 0,
      //     start_once: dStart === "yes" ? fixedStartAt : null,
      //   },
      // });

      const { data: response } = await axios.post("/v1/classroom/exam/update", {
        id: eid,
        title,
        content,
        status,
        audience: fixedAudience,
        duration: sDuration === "yes" ? duration : "0",
        start_once: dStart === "yes" ? fixedStartAt : null,
        questions,
      });

      if (response.status === "success") {
        setSuccess("Exam updated successfully.");
        router.push(`/classroom/${classId}/exam/${response.data.id}`);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }

    setLoading(false);
  };

  // handle question adder
  const handleAddQuestion = (question) => {
    setQuestions([...questions, question]);
    setOpenQBuilder(false);
  };

  // handle question remover
  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((q, i) => i !== index);
    setQuestions(newQuestions);
  };

  // handle question updater
  const handleUpdateQuestion = (index, question) => {
    const newQuestions = questions.map((q, i) => (i === index ? question : q));
    setQuestions(newQuestions);
    setOpenQUpdater(false);
  };

  // handle question index changer
  const handleQuestionIndexChange = (index, direction) => {
    const newQuestions = [...questions];
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= newQuestions.length) return;

    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[newIndex];
    newQuestions[newIndex] = temp;

    setQuestions(newQuestions);
  };

  // auto fill exam data
  React.useEffect(() => {
    // console.log(exam);
    if (exam) {
      setTitle(exam?.title ? exam?.title : "");
      setContent(
        exam?.content ? exam?.content : ""
      );
      setAudience(
        exam?.audience?.length > 0
          ? exam?.audience
          : []
      );
      setDuration(
        exam?.duration ? exam?.duration.toString() : "0"
      );
      setStartAt(
        exam?.start_once
          ? parseAbsoluteToLocal(exam?.start_once)
          : now(getLocalTimeZone())
      );
      setQuestions(
        exam?.questions?.length > 0
          ? exam?.questions
          : []
      );

      if (exam?.start_once) {
        setDStart("yes");
        setSDuration("yes");
      }
      if (exam?.duration !== 0) setSDuration("yes");
    }
  }, [exam]);

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

  if (classroomLoading) return <Loading />;

  return (
    <>
      <div>
        <h1 className="text-2xl font-black mb-5 font-exo">Update Exam</h1>
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
            my_id={userInfo.id}
            members={classroom?.classroom_relation}
            audience={audience}
            setAudience={setAudience}
            setOpenPicker={setOpenPicker}
          />
        )}
        <div>
          <div className="my-4">
            <Input
              label="Exam Title"
              className="w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            {content !== "loading....." && (
              <TinyEditor
                onInit={(evt, editor) => (editorRef.current = editor)}
                init={{
                  menubar: false,
                  // set colors font size etc
                  toolbar:
                    "blocks fontsize | bold italic underline | bullist numlist | forecolor backcolor | link image table | removeformat",
                  // toolbar_location: "bottom",
                  height: 750,
                  autoresize_bottom_margin: 50,
                  placeholder: "Write your exam details here...",
                  content_style:
                    "body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; }",
                  // autosave_ask_before_unload: true,
                  // autosave_interval: "30s",
                  // autosave_prefix: "classigoo-note-autosave-{path}{query}-{id}-",
                  // autosave_restore_when_empty: true,
                  paste_data_images: true,
                  image_uploadtab: true,
                  quickbars_insert_toolbar: false,
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
                value={content}
                onChange={(content) => setContent(content)}
                suppressHydrationWarning
              />
            )}
          </div>

          {/* questions */}
          <div className="my-5">
            <h1 className="text-xl font-black mb-5">Questions</h1>

            <div className="p-5 my-5 rounded-xl border-2 border-gray-200 dark:border-neutral-800 border-dashed">
              {questions.length > 0 ? (
                <div className="div">
                  {questions.map((question, index) => (
                    <div
                      key={index}
                      className="my-5 bg-content2 p-5 rounded-xl relative pb-14 lg:pb-5"
                    >
                      <div>
                        <div className="lg:flex justify-between items-center mb-2 ">
                          <p className="text-base font-exo font-medium text-gray-500 dark:text-neutral-300">
                            Question {index + 1}
                          </p>
                          <div className="bottom-4 left-0 right-0 absolute lg:static flex justify-center lg:justify-normal gap-2 lg:pl-5 ">
                            <Button
                              isIconOnly
                              variant="text"
                              disableAnimation={true}
                              className="bg-gray-200 dark:bg-neutral-700 rounded-lg font-medium w-10"
                              onPress={() =>
                                handleQuestionIndexChange(index, -1)
                              }
                            >
                              <Icon
                                icon="akar-icons:arrow-up"
                                className="text-lg"
                              />
                            </Button>
                            <Button
                              isIconOnly
                              variant="text"
                              disableAnimation={true}
                              className="bg-gray-200 dark:bg-neutral-700 rounded-lg font-medium w-10"
                              onPress={() =>
                                handleQuestionIndexChange(index, 1)
                              }
                            >
                              <Icon
                                icon="akar-icons:arrow-down"
                                className="text-lg"
                              />
                            </Button>
                            <Button
                              isIconOnly
                              variant="text"
                              disableAnimation={true}
                              className="bg-gray-200 dark:bg-neutral-700 rounded-lg font-medium w-10"
                              onPress={() => setOpenQUpdater(index)}
                            >
                              <Icon
                                icon="akar-icons:edit"
                                className="text-lg"
                              />
                            </Button>
                            <Button
                              isIconOnly
                              variant="text"
                              disableAnimation={true}
                              className="bg-gray-200 dark:bg-neutral-700 rounded-lg font-medium w-10"
                              onPress={() => handleRemoveQuestion(index)}
                            >
                              <Icon
                                icon="akar-icons:trash-can"
                                className="text-lg"
                              />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div
                            className="text-lg font-medium"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(question.question),
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="my-5">
                        <div className="">
                          <div className="flex flex-col lg:flex-row flex-1 gap-2 font-exo text-sm">
                            <p className="border-2 border-gray-300 dark:border-neutral-800 px-3 py-2 rounded-lg border-dotted">
                              <span className="font-medium">
                                Question Type:
                              </span>{" "}
                              {question.question_type}
                            </p>

                            <p className="border-2 border-gray-300 dark:border-neutral-800 px-3 py-2 rounded-lg border-dotted">
                              <span className="font-medium">Points:</span>{" "}
                              {question.points}
                            </p>

                            <p className="border-2 border-gray-300 dark:border-neutral-800 px-3 py-2 rounded-lg border-dotted">
                              <span className="font-medium">Answer Type:</span>{" "}
                              {question.answer_type}
                            </p>
                          </div>
                          {question.question_type === "objective" && (
                            <>
                              <div className="mt-5">
                                <h3 className="text-sm font-medium">
                                  <span className="font-medium">Options:</span>
                                </h3>
                                <ol className="mt-1 list-decimal flex flex-col gap-2">
                                  {question.options.map((option, i) => (
                                    <li key={i} className="flex gap-2">
                                      <p>
                                        <span className="font-medium pr-2">
                                          {i + 1})
                                        </span>
                                        {option}
                                      </p>
                                      {option.is_correct && (
                                        <Icon
                                          icon="akar-icons:check"
                                          className="text-green-500"
                                        />
                                      )}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                              <div className="mt-5">
                                <h3 className="text-sm font-medium">
                                  <span className="font-medium">
                                    {question.answer_type === "single"
                                      ? "Correct Option"
                                      : "Correct Options"}
                                    :
                                  </span>
                                </h3>
                                <p className="mt-1 list-decimal flex gap-2">
                                  {question.answer_type === "single"
                                    ? question.answer
                                    : question.answer.join(", ")}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-lg font-bold">No Questions Added</p>
                  <p className="text-sm text-gray-500 dark:text-neutral-300">
                    Click the button below to add questions to the exam. You can
                    add multiple questions to the exam.
                  </p>
                </div>
              )}

              <div className="mt-5">
                <Button
                  variant="text"
                  className="border-2 border-dotted text-gray-500 border-gray-200 dark:border-neutral-800 rounded-lg font-medium w-full hover:bg-content2"
                  onPress={() => setOpenQBuilder(true)}
                >
                  <Icon icon="akar-icons:plus" className="text-2xl" />
                </Button>
              </div>
            </div>
          </div>

          {/* bottom */}
          <div className="my-5 flex flex-col 2xl:flex-row gap-5">
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
              <Select
                label="Set Starts At"
                className="w-full"
                placeholder="Do you want to set a start date?"
                selectedKeys={[dStart]}
                onChange={(e) => {
                  if (e.target.value === "yes") {
                    setStartAt(now(getLocalTimeZone()));
                    setSDuration("yes");
                    setDuration("0");
                    setDStart(e.target.value);
                  } else {
                    setDStart(e.target.value);
                  }
                }}
              >
                <SelectItem key="no">No</SelectItem>
                <SelectItem key="yes">Yes</SelectItem>
              </Select>
            </div>
            {dStart === "yes" && (
              <div className="flex-1 grid items-center">
                <DatePicker
                  hideTimeZone={false}
                  showMonthAndYearPickers
                  value={startAt}
                  onChange={setStartAt}
                  label="Select Start Time"
                  variant="flat"
                />
              </div>
            )}
            {dStart !== "yes" && (
              <div className="flex-1 grid items-center">
                <Select
                  label="Set Exam Duration"
                  className="w-full"
                  placeholder="Do you want to set a start date?"
                  selectedKeys={[sDuration]}
                  isDisabled={dStart === "yes"}
                  onChange={(e) => setSDuration(e.target.value)}
                >
                  <SelectItem key="no">No</SelectItem>
                  <SelectItem key="yes">Yes</SelectItem>
                </Select>
              </div>
            )}

            {sDuration === "yes" && (
              <div className="flex-1 grid items-center">
                <Input
                  label="Duration (minutes)"
                  className="w-full"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            )}
            <div className="flex-1">
              <div className="my-5 grid items-center">
                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                  <Button
                    variant="text"
                    isLoading={loading === "ended"}
                    isDisabled={loading === "draft" || loading === "published"}
                    className="w-full 2xl:w-auto bg-danger-500 text-background rounded-none font-medium"
                    onPress={() => {
                      handleUpdateExam("ended");
                    }}
                  >
                    End Exam
                  </Button>
                  <Button
                    variant="text"
                    isLoading={loading === "draft"}
                    isDisabled={loading === "published" || loading === "ended"}
                    className="w-full 2xl:w-auto bg-primary-500 text-background rounded-none font-medium"
                    onPress={() => {
                      handleUpdateExam("draft");
                    }}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="text"
                    isLoading={loading === "published"}
                    isDisabled={loading === "draft" || loading === "ended"}
                    className="w-full 2xl:w-auto bg-black dark:bg-white text-background rounded-none font-medium"
                    onPress={() => {
                      handleUpdateExam("published");
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

      {openQBuilder && (
        <QuestionBuilder
          addQuestion={handleAddQuestion}
          cancleQuestion={() => setOpenQBuilder(false)}
        />
      )}

      {openQUpdater !== false && (
        <QuestionUpdater
          index={openQUpdater}
          updateQuestion={handleUpdateQuestion}
          cancleQuestion={() => setOpenQUpdater(false)}
          question={questions[openQUpdater]}
        />
      )}
    </>
  );
}
