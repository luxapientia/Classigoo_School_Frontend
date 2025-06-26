"use client";
import React from "react";
import axios from "@lib/axios"
import moment from "moment";
import { Icon } from "@iconify/react";
import TinyEditor from "@components/common/editor";
import { Input, DateRangePicker, Button, Alert } from "@heroui/react";
import { parseAbsoluteToLocal } from "@internationalized/date";

// import { CREATE_SCHEDULE } from "@graphql/mutations";
// import { useMutation } from "@apollo/client";

export default function EventCreator({ cid, setEventCreator }) {
  const editorRef = React.useRef(null);
  const [title, setTitle] = React.useState("");
  const [init, setInit] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [creating, setCreating] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState(moment().toISOString());
  const [endDate, setEndDate] = React.useState(moment().add(1, "days").toISOString());

  // const [createSchedule] = useMutation(CREATE_SCHEDULE);

  const handleCreateSchedule = async () => {
    setCreating(true);
    try {
      if (!title || !description) {
        setError("Please fill all the fields");
        setCreating(false);
        return;
      }

      // const { data } = await createSchedule({
      //   variables: {
      //     cid,
      //     title,
      //     description,
      //     sTime: startDate,
      //     eTime: endDate,
      //   },
      // });

      const { data: res } = await axios.post('/v1/classroom/schedule/create', {
        class_id: cid,
        title,
        description,
        start_time: startDate,
        end_time: endDate
      })

      if (res.status === "success" && res.data.id) {
        setSuccess("Event created successfully");
        setTitle("");
        setDescription("");
        setStartDate(moment().toISOString());
        setEndDate(moment().add(1, "days").toISOString());
        setCreating(false);
        setEventCreator(false);
      } else {
        setError("Error creating event");
        setCreating(false);
      }
    } catch (error) {
      console.log(error);
      setError("Error creating event");
      setCreating(false);
    }
  };

  React.useEffect(() => {
    setInit(true);
  }, []);

  const handleEventTimechange = (range) => {
    const start = range.start.toAbsoluteString();
    const end = range.end.toAbsoluteString();
    setStartDate(start);
    setEndDate(end);
  };

  const handleCancleEvent = () => {
    setInit(false);
    setTitle("");
    setDescription("");
    setStartDate(moment().toISOString());
    setEndDate(moment().add(1, "days").toISOString());
    setEventCreator(false);
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/10 backdrop-blur-lg grid justify-center content-center z-[999]"
      suppressHydrationWarning
    >
      <div className="w-[750px] max-w-[calc(100vw_-_20px)] max-h-[calc(100vh_-_120px)] p-5 bg-white dark:bg-black rounded-xl overflow-x-hidden overflow-y-auto">
        {init ? (
          <div>
            <Alert
              color="danger"
              description={error}
              isVisible={error}
              title={"Something went wrong"}
              variant="faded"
              onClose={() => setError(null)}
            />
            <h1 className="text-2xl font-bold text-center">Create Event</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
              Add an event to your classroom calendar so everyone can see it.
            </p>
            <div className="my-3">
              <Input
                type="text"
                label="Event Title"
                placeholder="Example: Visit to the zoo!"
                className="w-full"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                value={title}
              />
            </div>

            <div className="my-3" suppressHydrationWarning>
              <TinyEditor
                onInit={(evt, editor) => (editorRef.current = editor)}
                suppressHydrationWarning
                init={{
                  menubar: false,
                  // set colors font size etc
                  toolbar: "bold italic underline | bullist numlist | link",
                  toolbar_location: "bottom",
                  quickbars_insert_toolbar: false,
                  height: 750,
                  autoresize_bottom_margin: 50,
                  placeholder: "Event description",
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
                value={description}
                onChange={(q) => setDescription(q)}
              />
            </div>
            <div className="my-3 bg-content2 rounded-xl">
              <DateRangePicker
                label="Even time"
                className="overflow-y-hidden overflow-x-auto"
                defaultValue={{
                  start: parseAbsoluteToLocal(startDate),
                  end: parseAbsoluteToLocal(endDate),
                }}
                // selectorButtonPlacement="start"
                onChange={handleEventTimechange}
              />
            </div>
            <div className="flex justify-end">
              <Button
                variant="text"
                color="gray"
                className="mr-2 bg-black dark:bg-white rounded-none text-white dark:text-gray-900"
                isDisabled={creating}
                onClick={() => {
                  handleCancleEvent();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="text"
                className="rounded-none bg-primary-500 text-white"
                isLoading={creating}
                onClick={() => {
                  handleCreateSchedule();
                }}
              >
                Create Event
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-16 grid justify-center content-center">
            <Icon icon="eos-icons:three-dots-loading" className="w-10 h-10  text-green-500" />
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
}
