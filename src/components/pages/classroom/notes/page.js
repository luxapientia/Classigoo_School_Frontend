"use client";
import React from "react";
import moment from "moment";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Tooltip } from "@heroui/react";
import ClassroomLayout from "../layout/layout";
import { useSubscription } from "@apollo/client";
import {
  SUB_GET_CLASSROOM,
  SUB_GET_CLASSROOM_NOTES,
} from "@graphql/subscriptions";

export default function ClassroomNotesMain({ id, session }) {
  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_GET_CLASSROOM, {
    variables: { id },
  });

  const {
    data: sub_data_notes,
    loading: sub_loading_notes,
    error: sub_error_notes,
  } = useSubscription(SUB_GET_CLASSROOM_NOTES, {
    variables: { cid: id },
  });

  return (
    <>
      <ClassroomLayout
        id={id}
        loading={sub_loading || sub_loading_notes}
        classroom={sub_data?.classrooms_by_pk}
      >
        {sub_data_notes?.notes.length > 0 ? (
          <div className="grid gap-4 grid-cols-3">
            {sub_data_notes?.notes.map((note) => (
              <Link
                href={`/note/${note.id}`}
                key={note.id}
                className="cursor-pointer"
              >
                <div className="shadow rounded-xl p-5">
                  <div className="flex">
                    <div className="flex-initial pr-4">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-2 grid justify-center items-center h-16 w-16">
                        <Icon
                          icon="solar:notebook-bold-duotone"
                          className="w-8 h-8 text-gray-500 dark:text-gray-200"
                        />
                      </div>
                    </div>
                    <div className="flex-auto">
                      {note.title.length > 20 ? (
                        <Tooltip color="default" content={note.title}>
                          <h2 className="text-base font-semibold font-exo">
                            {note.title.substring(0, 20) + "..."}
                          </h2>
                        </Tooltip>
                      ) : (
                        <h2 className="text-base font-semibold font-exo">
                          {note.title}
                        </h2>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last updated:{" "}
                        {moment(note.updated_at).format("MMM DD, YYYY")}
                      </p>
                      {note.status === "draft" ? (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          Draft
                        </span>
                      ) : (
                        <span className="text-xs text-green-500 dark:text-green-400">
                          Published
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-16">
            <div className="border-2 rounded-xl border-gray-500 h-48 border-dashed grid content-center justify-center">
              <h1 className="text-2xl font-bold text-center">No Notes Found</h1>
              <div className="mt-5 mx-auto">
                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                  You will find notes here when a teacher publishes a note for
                  this classroom.
                </p>
              </div>
            </div>
          </div>
        )}
      </ClassroomLayout>
    </>
  );
}
