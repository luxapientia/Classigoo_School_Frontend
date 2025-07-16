"use client";

import React from "react";
import axios from "@lib/axios";
import moment from "moment";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Loading from "@components/common/loading";
import { HeaderSlot } from "@components/layout/header";
import { useSocket } from "@hooks/useSocket";

// import { useSubscription } from "@apollo/client";
// import SUB_GET_NOTES from "@graphql/subscriptions/subGetNotes";
import { Tooltip } from "@heroui/react";

export default function NotesMainComponent({ userInfo }) {

  const [notes, setNotes] = React.useState([]);
  const [notesLoading, setNotesLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // fetch notes
  const fetchNotes = React.useCallback(async () => {
    setNotesLoading(true);
    try {
      const { data: res } = await axios.get(`/v1/note/list/${userInfo._id}`);
      setNotes(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load notes");
    }

    setNotesLoading(false);
  }, []);
  
  React.useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  if (notesLoading) return <Loading />;

  // const { data, loading, error } = useSubscription(SUB_GET_NOTES, {
  //   variables: {
  //     uid: user.sub,
  //   },
  // });

  // if (loading) return <Loading />;

  return (
    <div>
      <HeaderSlot>
        <Link
          href="/note/create"
          className="hidden md:flex items-center bg-content2 text:content1 px-4 py-2 border-2 rounded-xl"
        >
          <Icon icon="akar-icons:plus" />
          <span className="ml-1">Create Note</span>
        </Link>
        <Link
          href="/note/create"
          className="grid md:hidden justify-center items-center h-[44px] w-[44px] rounded-full px-0 bg-blue-500 text-white shadow-[0px_0px_5px_1px_#3b82f6c7]"
        >
          <Icon icon="akar-icons:plus" />
        </Link>
      </HeaderSlot>

      {error && <p className="text-danger bg-danger/10 text-xs px-4 py-2 mt-2 w-full rounded-lg">{error}</p>}

      {notes?.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
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
        <div>
          <div className="border-2 rounded-xl border-gray-500 h-48 border-dashed grid content-center justify-center">
            <h1 className="text-2xl font-bold text-center">No Notes Found</h1>
            <div className="mt-5 mx-auto">
              <Link href="/note/create">
                <button className="rounded-none font-medium text-sm bg-blue-500 text-white px-4 py-2">
                  Create Note
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
