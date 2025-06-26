"use client";

import React from "react";
import moment from "moment";
import DOMPurify from "dompurify";
import { Button, cn, User } from "@heroui/react";

export default function EventViewer({ event, setEventViewer }) {
  const [status, setStatus] = React.useState(false);

  React.useEffect(() => {
    const startTime = moment(event?.start_time);
    const endTime = moment(event?.end_time);

    const now = moment();

    if (now.isBefore(startTime)) {
      setStatus("Upcoming");
    }

    if (now.isAfter(startTime) && now.isBefore(endTime)) {
      setStatus("Ongoing");
    }

    if (now.isAfter(endTime)) {
      setStatus("Ended");
    }
  }, [event]);

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/10 backdrop-blur-lg grid justify-center content-center z-[999]"
      suppressHydrationWarning
    >
      <div className="w-[750px] max-w-[calc(100vw_-_20px)] max-h-[calc(100vh_-_120px)] p-5 bg-white dark:bg-black rounded-xl overflow-x-hidden overflow-y-auto">
        <div>
          <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">{event?.title}</h1>
        </div>
        <div className="my-5  bg-gray-100 dark:bg-neutral-700 p-5 rounded-xl">
          <article
            className="prose prose-p:text-sm prose-invert dark:prose-invert max-w-none text-gray-900 dark:text-white"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(event?.description),
            }}
          ></article>
        </div>

        <div>
          <div className="flex flex-col md:flex-row w-full justify-between items-center mb-2 gap-5 bg-gray-100 dark:bg-neutral-700 p-5 rounded-xl">
            <div className="flex-1 w-full grid justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold text-center">Start Date</p>
              <p className="text-gray-900 dark:text-white text-lg font-black text-center">
                {moment(event?.start_time).format("Do MMMM, YYYY")}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-base text-center font-bold">
                {moment(event?.start_time).format("hh:mm A")}
              </p>
            </div>
            <div className="flex-1 w-full grid justify-center">
              {/* <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold text-center">Status</p> */}
              <p
                className={cn(
                  "text-lg font-black text-center uppercase",
                  status === "Upcoming" ? "text-green-500" : status === "Ongoing" ? "text-blue-500" : "text-red-500"
                )}
              >
                {status}
              </p>
            </div>
            <div className="flex-1 w-full grid justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold text-center">End Date</p>
              <p className="text-gray-900 dark:text-white text-lg font-black text-center">
                {moment(event?.end_time).format("Do MMMM, YYYY")}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-base text-center font-bold">
                {moment(event?.end_time).format("hh:mm A")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full justify-between items-center my-5 gap-5 bg-gray-100 dark:bg-neutral-700 p-5 rounded-xl">
          <div className="flex-1 w-full grid justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold text-center mb-2">Created By</p>
            <User
              avatarProps={{
                src: event?.owner?.avatar?.url,
                alt: event?.owner?.name,
                className: "rounded-full",
                isBordered: true,
                size: "sm",
              }}
              classNames={{
                name: "font-bold text-gray-900 dark:text-white",
                description: "text-gray-600 dark:text-gray-400 font-semibold",
              }}
              description={event?.owner?.email}
              name={event?.owner?.name}
            />
          </div>
          <div className="flex-1 w-full grid justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold text-center mb-2">Created At</p>
            <p className="text-gray-900 dark:text-white text-sm font-bold text-center">
              {moment(event?.created_at).format("Do MMMM YYYY")}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs text-center font-bold">
              {moment(event?.created_at).format("hh:mm A")}
            </p>
          </div>
          <div className="flex-1 w-full grid justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold text-center mb-2">Last Updated At</p>
            <p className="text-gray-900 dark:text-white text-sm font-bold text-center">
              {moment(event?.updated_at).format("Do MMMM YYYY")}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs text-center font-bold">
              {moment(event?.updated_at).format("hh:mm A")}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="text"
            color="gray"
            className="bg-black dark:bg-white rounded-none text-white dark:text-gray-900"
            onClick={() => {
              setEventViewer({});
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
