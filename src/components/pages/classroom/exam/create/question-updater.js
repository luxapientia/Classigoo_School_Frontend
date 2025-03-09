"use client";
import TinyEditor from "@components/common/editor";
import { Alert, Button, Checkbox, Input, Radio, RadioGroup, Select, SelectItem } from "@heroui/react";
import { useState, useRef, useEffect } from "react";

export default function QuestionBuilder({ index, question: qobj, updateQuestion, cancleQuestion }) {
  const editorRef = useRef(null);

  const [question, setQuestion] = useState(qobj.question || "");
  console.log("qobj", qobj);
  const [questionType, setQuestionType] = useState(qobj.question_type || null);
  const [answerType, setAnswerType] = useState(qobj.answer_type || null);

  const [options, setOptions] = useState(qobj.options || ["", ""]);
  const [answer, setAnswer] = useState(qobj.answer || "");
  const [marks, setMarks] = useState(qobj.points || 0);

  const [error, setError] = useState([]);
  const [errorKeys, setErrorKeys] = useState([]);

  const updateQuestionMiddleware = () => {
    setError([]);

    let errors = [];

    if (question === "") {
      setErrorKeys((e) => [...e, "question"]);
      errors.push({
        type: "question",
        message: "Question is required",
      });
    }

    if (marks <= 0) {
      setErrorKeys((e) => [...e, "marks"]);
      errors.push({
        type: "marks",
        message: "Marks must be greater than 0",
      });
    }

    if (questionType === null) {
      setErrorKeys((e) => [...e, "questionType"]);
      errors.push({
        type: "questionType",
        message: "Question Type is required",
      });
    }

    if (answerType === null) {
      setErrorKeys((e) => [...e, "answerType"]);
      errors.push({
        type: "answerType",
        message: "Answer Type is required",
      });
    }

    if (questionType === "objective" && (answerType === "single" || answerType === "multiple")) {
      setErrorKeys((e) => [...e, "options"]);
      if (options.length < 2) {
        errors.push({
          type: "options",
          message: "Atleast 2 options are required",
        });
      }

      if (options.filter((opt) => opt === "").length > 0) {
        setErrorKeys((e) => [...e, "options"]);
        errors.push({
          type: "options",
          message: "Options can't be empty",
        });
      }

      // check if duplicate options
      if (options.filter((opt) => opt === answer).length > 1) {
        setErrorKeys((e) => [...e, "optionsSame"]);
        errors.push({
          type: "optionsSame",
          message: "Multiple options can't have same value",
        });
      }
    }

    if (questionType === "objective" && answerType !== "single" && answerType !== "multiple") {
      setErrorKeys((e) => [...e, "answerType"]);
      errors.push({
        type: "answerType",
        message: "Answer Type is not valid for Objective Question",
      });
    }

    if (questionType === "subjective" && answerType !== "text" && answerType !== "image") {
      setErrorKeys((e) => [...e, "answerType"]);
      errors.push({
        type: "answerType",
        message: "Answer Type is not valid for Subjective Question",
      });
    }

    if (answerType === "single" && answer === "") {
      setErrorKeys((e) => [...e, "answer"]);
      errors.push({
        type: "answer",
        message: "Answer is required",
      });
    }

    if (answerType === "multiple" && answer.length === 0) {
      setErrorKeys((e) => [...e, "answer"]);
      errors.push({
        type: "answer",
        message: "Answer is required",
      });
    }

    if (errors.length > 0) {
      setError(errors);
    } else {
      updateQuestion(index, {
        id: qobj.id,
        question,
        question_type: questionType,
        answer_type: answerType,
        options,
        answer,
        points: marks,
      });
    }
  };

  useEffect(() => {
    if (error.length > 0) {
      const timer = setTimeout(() => {
        setError([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    // if answer type is multipe and answer is not array then set it to empty array
    if (answerType === "multiple" && !Array.isArray(answer)) {
      return setAnswer([]);
    } else {
      if (answerType === "single" && Array.isArray(answer)) {
        return setAnswer("");
      }
    }
  }, [answerType]);

  const handleAnswerSelect = (ans, checked) => {
    if (answerType === "single") {
      setAnswer(ans);
    } else {
      if (checked) {
        setAnswer((prev) => [...prev, ans]);
      } else {
        setAnswer((prev) => prev.filter((p) => p !== ans));
      }
    }
  };

  return (
    <>
      <div className="fixed top-0 bottom-0 left-0 right-0 z-50 w-full h-full bg-black bg-opacity-50 backdrop-blur-md grid justify-center content-center">
        <div className="bg-white dark:bg-neutral-700 rounded-lg p-5 max-w-[calc(100%_-_20px)] w-[750px] max-h-[calc(100vh_-_50px)] overflow-y-auto">
          <h1 className="text-2xl font-bold text-center font-exo my-4 mb-8">Update Question</h1>
          {error?.length > 0 && (
            <Alert
              color="danger"
              title="Please fill all the fields correctly"
              className="mb-5"
              onClose={() => setError(false)}
            >
              <ul className="list-disc list-inside mt-1">
                {error.map((err, index) => (
                  <li key={index} className="text-sm">
                    {err.message}
                  </li>
                ))}
              </ul>
            </Alert>
          )}
          <div>
            <TinyEditor
              onInit={(evt, editor) => (editorRef.current = editor)}
              init={{
                menubar: false,
                // set colors font size etc
                toolbar:
                  "bold italic underline | bullist numlist | image table | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry | removeformat",
                toolbar_location: "bottom",
                quickbars_insert_toolbar: false,
                height: 750,
                autoresize_bottom_margin: 50,
                placeholder: "Write your question here...",
                content_style: "body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; }",
                paste_data_images: true,
                // autosave_ask_before_unload: true,
                // autosave_interval: "30s",
                // autosave_prefix: "classigoo-note-autosave-{path}{query}-{id}-",
                // autosave_restore_when_empty: true,
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
              value={question}
              onChange={(q) => setQuestion(q)}
              suppressHydrationWarning
            />
            {/* filter to get question error */}
            {/* {error.filter((err) => err.type === "question").length > 0 && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1 font-medium">Question is required</p>
            )} */}
          </div>

          <div className="my-4">
            <Input
              label="Marks"
              type="number"
              placeholder="Enter Marks"
              value={marks}
              // isInvalid={marks <= 0 ? true : false}
              onChange={(e) => setMarks(e.target.value)}
            />
          </div>

          <div className="my-4">
            <div>
              <Select
                label="Question Type"
                placeholder="Select Question Type"
                selectedKeys={[questionType]}
                onChange={(e) => setQuestionType(e.target.value)}
                // isInvalid={questionType === null ? true : false}
              >
                <SelectItem key="objective">Objective</SelectItem>
                <SelectItem key="subjective">Subjective</SelectItem>
              </Select>
            </div>

            {questionType && (
              <div className="my-4">
                {questionType === "objective" && (
                  <Select
                    label="Answer Type"
                    placeholder="Select Answer Type"
                    selectedKeys={[answerType]}
                    onChange={(e) => setAnswerType(e.target.value)}
                    // isInvalid={answerType === "single" || answerType === "multiple" ? false : true}
                  >
                    <SelectItem key="single">Single</SelectItem>
                    <SelectItem key="multiple">Multiple</SelectItem>
                  </Select>
                )}

                {questionType === "subjective" && (
                  <Select
                    label="Answer Type"
                    placeholder="Select Answer Type"
                    selectedKeys={[answerType]}
                    onChange={(e) => setAnswerType(e.target.value)}
                    // isInvalid={answerType === "text" || answerType === "image" ? false : true}
                  >
                    <SelectItem key="text">Textbox</SelectItem>
                    <SelectItem key="image">Image</SelectItem>
                  </Select>
                )}
              </div>
            )}
          </div>

          {questionType === "objective" && (answerType == "single" || answerType == "multiple") && (
            <div className="my-5">
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 border-dashed">
                <h2 className="text-lg font-semibold">Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {answerType === "single" &&
                    // radio group but editable input and at last select one as answer 2 data can't be same
                    options.map((option, index) => {
                      return (
                        <div key={index} className="flex items-center w-full">
                          <RadioGroup
                            value={answer}
                            onChange={(e) => handleAnswerSelect(e.target.value)}
                            className="mr-2"
                          >
                            <Radio value={option} />
                          </RadioGroup>
                          <Input
                            value={option}
                            isInvalid={
                              options.filter((opt) => opt === option).length > 1 || option === "" ? true : false
                            }
                            onChange={(e) => {
                              options[index] = e.target.value;
                              setOptions([...options]);
                            }}
                          />
                        </div>
                      );
                    })}

                  {answerType === "multiple" &&
                    // checkbox group but editable input and at last select one as answer 2 data can be same
                    options.map((option, index) => {
                      return (
                        <div key={index} className="flex items-center w-full">
                          {/* <RadioGroup value={answer} onChange={(e) => setAnswer(e.target.value)} className="mr-4">
                            <Radio value={option} />
                          </RadioGroup> */}
                          <Checkbox
                            value={option}
                            isSelected={answer.includes(option)}
                            onChange={(e) => {
                              handleAnswerSelect(e.target.value, e.target.checked);
                            }}
                          />
                          <Input
                            value={option}
                            isInvalid={option === "" ? true : false}
                            onChange={(e) => {
                              options[index] = e.target.value;
                              setOptions([...options]);
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
                <div className="flex items-center w-full">
                  <Button
                    variant="text"
                    onClick={() => {
                      setOptions([...options, ""]);
                    }}
                    className="w-full text-center border-2 border-dotted border-gray-200 dark:border-gray-700 mt-4"
                  >
                    Add Option
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <Button
              variant="text"
              className="rounded-none bg-red-500 text-background font-medium mr-2"
              onClick={cancleQuestion}
            >
              Cancel
            </Button>
            <Button
              variant="text"
              className="rounded-none bg-primary-500 text-background font-medium"
              onClick={updateQuestionMiddleware}
            >
              Update Question
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
