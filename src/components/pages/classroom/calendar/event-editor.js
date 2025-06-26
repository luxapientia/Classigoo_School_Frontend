"use client";
import React from "react";
import axios from "@lib/axios";
import moment from "moment";
import { Icon } from "@iconify/react";
import TinyEditor from "@components/common/editor";
import { Input, DateRangePicker, Button, Alert } from "@heroui/react";

import { parseAbsoluteToLocal } from "@internationalized/date";

// import { useMutation } from "@apollo/client";
// import { UPDATE_SCHEDULE } from "@graphql/mutations";

export default function EventEditor({ event, setEventEditor }) {
  console.log(event);
  const [title, setTitle] = React.useState(event?.title || "");
  const [description, setDescription] = React.useState(event?.description || "");
  const [startDate, setStartDate] = React.useState(moment(event?.start_time).toISOString() || "");
  const [endDate, setEndDate] = React.useState(moment(event?.end_time).toISOString() || "");
  const [init, setInit] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [updating, setUpdating] = React.useState(false);

  // const [updateSchedule] = useMutation(UPDATE_SCHEDULE);

  React.useEffect(() => {
    if (event?.description) {
      setInit(true);
    }
  }, []);

  const handleUpdateSchedule = async () => {
    setUpdating(true);
    try {
      if (!title || !description) {
        setError("Please fill all the fields");
        setUpdating(false);
        return;
      }

      // const { data } = await updateSchedule({
      //   variables: {
      //     eid: event?.id,
      //     title,
      //     description,
      //     sTime: startDate,
      //     eTime: endDate,
      //   },
      // });

      const { data: res } = await axios.post(`/v1/classroom/schedule/update`, {
        id: event?.id,
        title,
        description,
        start_time: startDate,
        end_time: endDate
      })

      if (res.status === "success" && res.data.id) {
        setSuccess("Event updated successfully");
        setTitle("");
        setDescription("");
        setStartDate(moment().toISOString());
        setEndDate(moment().add(1, "days").toISOString());
        setUpdating(false);
        setEventEditor(false);
      } else {
        setError("Error updating event");
        setUpdating(false);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
      setUpdating(false);
    }
  };

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
    setEventEditor(false);
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
            <h1 className="text-2xl font-bold text-center">Update Event</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
              Update your event details below. Make sure to include all the necessary information for your event.
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
                isDisabled={updating}
                onClick={() => {
                  handleCancleEvent();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="text"
                className="rounded-none bg-primary-500 text-white"
                isLoading={updating}
                onClick={() => {
                  handleUpdateSchedule();
                }}
              >
                Update Event
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
