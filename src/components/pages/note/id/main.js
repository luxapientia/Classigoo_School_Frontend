"use client";
import xss from "xss";
import React from "react";
import axios from "@lib/axios";
import moment from "moment";
import Link from "next/link";
import DOMPurify from "dompurify";
import NotFoundPage from "@app/not-found";
import "@components/common/tinymce.css";
import { Alert, Button, User } from "@heroui/react";
import Loading from "@components/common/loading";
// import { DELETE_NOTE } from "@graphql/mutations";
// import { SUB_GET_NOTE } from "@graphql/subscriptions";
// import { useMutation, useSubscription } from "@apollo/client";
import DeleteNoteAction from "./delete-note-action";

export default function NotePageMainComponent({ userInfo, id }) {
  // const [deleteNote] = useMutation(DELETE_NOTE);
  const [note, setNote] = React.useState(null);
  const [noteLoading, setNoteLoading] = React.useState(false);
  const [d_error, setError] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  // const { data, loading, error } = useSubscription(SUB_GET_NOTE, {
  //   variables: { id },
  // });

  // fetch note
  const fetchNote = React.useCallback(async () => {
    setNoteLoading(true);
    try {
      const { data: res } = await axios.get(`/v1/note/${id}`);
      setNote(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load note");
    }
    setNoteLoading(false);
  }, [id]);

  React.useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  const handleDeleteNote = async () => {
    setDeleteLoading(true);
    try {
      // await deleteNote({
      //   variables: { id },
      // });

      const { data: res } = await axios.delete(`/v1/note/${id}`);

      window.location.replace("/notes");
    } catch (error) {
      setError(error);
      setDeleteLoading(false);
    }
    setShowDeleteModal(false);
  };

  React.useEffect(() => {
    if (d_error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [d_error]);

  if (noteLoading) return <Loading />;
  if (note === null) return <NotFoundPage />;

  return (
    <>
      {showDeleteModal && (
        <DeleteNoteAction
          handleSubmit={handleDeleteNote}
          handleClose={() => setShowDeleteModal(false)}
          loading={deleteLoading}
        />
      )}
      <div className="flex flex-col gap-4">
        {d_error && (
          <div className="mb-4">
            <Alert
              color="danger"
              title="Something went wrong!"
              description={d_error.message}
            />
          </div>
        )}

        <h1 className="text-lg md:text-xl lg:text-2xl p-5 bg-content2 font-bold rounded-xl">
          {note?.title}
        </h1>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-auto px-10 py-4 bg-content2 rounded-xl">
            <article
              // id="editor_rendered"
              className="prose max-w-none prose-lg prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-md prose-ul:list-disc prose-ol:list-decimal prose-table:border-collapse prose-table:border prose-table:border-gray-300 prose-th:border prose-th:p-2 prose-th:bg-gray-100 prose-td:border prose-td:p-2 prose-td:text-gray-700 prose-strong:text-gray-800 dark:prose-headings:text-gray-100 dark:prose-p:text-gray-300 dark:prose-a:text-blue-400 dark:prose-blockquote:border-gray-600 dark:prose-th:bg-gray-800 dark:prose-td:text-gray-300 dark:prose-table:border-gray-600 dark:prose-strong:text-gray-100"
              dangerouslySetInnerHTML={{
                // __html: xss(note?.content)
                // __html: DOMPurify.sanitize(note?.content),
                __html: note?.content,
              }}
            ></article>
          </div>
          <div className="flex-initial">
            <div className="p-5 bg-content2 w-full lg:w-72 rounded-xl">
              <h1 className="text-xl font-bold mb-2">Author</h1>

              <User
                avatarProps={{
                  src: note?.owner_data?.avatar?.url,
                  alt: note?.owner_data?.name,
                }} 
                name={note?.owner_data?.name}
                description={note?.owner_data?.email}
              />
            </div>

            <div className="p-5 bg-content2 w-full lg:w-72 rounded-xl mt-4">
              <h2 className="text-sm">
                Status:{" "}
                <span className="font-semibold">
                  {note?.status.toUpperCase()}
                </span>
              </h2>
              <h2 className="text-sm">
                Last Updated:{" "}
                <span className="font-semibold">
                  {moment(note?.updated_at).fromNow()}
                </span>
              </h2>
            </div>
            <div className="p-5 bg-content2 w-full lg:w-72 rounded-xl mt-4">
              <h2 className="text-sm">Shared with classrooms: </h2>
              {note?.classroom_notes.length > 0 ? (
                <ul className="list-disc list-inside mt-1">
                  {note?.classroom_notes.map((classroom) => (
                    <li key={classroom.classroom.name} className="text-xs">
                      <Link
                        href={`/classroom/${classroom.classroom.id}`}
                        className="underline"
                      >
                        {classroom.classroom.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs">Not shared with any classroom</p>
              )}
            </div>

            {/* if owner == current user */}
            {userInfo.id === note?.owner_data.id && (
              <div className="p-5 bg-content2 w-full lg:w-72 rounded-xl mt-4">
                <div className="w-full">
                  <Button
                    variant="text"
                    className="bg-primary-500 text-background rounded-lg font-medium w-full"
                    onPress={() => window.location.replace(`/note/${id}/edit`)}
                  >
                    Edit Note
                  </Button>
                </div>

                <div className="mt-2 w-full">
                  <Button
                    variant="text"
                    className="bg-red-500 text-background rounded-lg font-medium w-full"
                    onPress={() => setShowDeleteModal(true)}
                  >
                    Delete Note
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
