"use client";
import xss from "xss";
import React from "react";
import moment from "moment";
import Link from "next/link";
import NotFoundPage from "@app/not-found";
import "@components/common/tinymce.css";
import { Alert, Button, User } from "@heroui/react";
import Loading from "@components/common/loading";
import { DELETE_NOTE } from "@graphql/mutations";
import { SUB_GET_NOTE } from "@graphql/subscriptions";
import { useMutation, useSubscription } from "@apollo/client";
import DeleteNoteAction from "./delete-note-action";

export default function NotePageMainComponent({ user, id }) {
  const [deleteNote] = useMutation(DELETE_NOTE);
  const [d_error, setError] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const { data, loading, error } = useSubscription(SUB_GET_NOTE, {
    variables: { id },
  });

  const handleDeleteNote = async () => {
    setDeleteLoading(true);
    try {
      await deleteNote({
        variables: { id },
      });
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

  if (loading) return <Loading />;
  if (data?.notes_by_pk === null) return <NotFoundPage />;

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
            <Alert color="danger" title="Something went wrong!" description={d_error.message} />
          </div>
        )}

        <h1 className="text-2xl  p-5 bg-content2 font-bold rounded-xl">{data?.notes_by_pk?.title}</h1>
        <div className="flex gap-4">
          <div className="flex-auto px-10 py-4 bg-content2 rounded-xl">
            <article
              id="editor_rendered"
              // className="prose max-w-none prose-lg prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-md prose-ul:list-disc prose-ol:list-decimal prose-table:border-collapse prose-table:border prose-table:border-gray-300 prose-th:border prose-th:p-2 prose-th:bg-gray-100 prose-td:border prose-td:p-2 prose-td:text-gray-700"
            >
              <div dangerouslySetInnerHTML={{ __html: xss(data?.notes_by_pk?.content) }}></div>
            </article>
          </div>
          <div className="flex-initial">
            <div className="p-5 bg-content2 w-72 rounded-xl">
              <h1 className="text-xl font-bold mb-2">Author</h1>

              <User
                avatarProps={{
                  src: data?.notes_by_pk?.owner_data?.avatar,
                  alt: data?.notes_by_pk?.owner_data?.name,
                }}
                name={data?.notes_by_pk?.owner_data?.name}
                description={data?.notes_by_pk?.owner_data?.email}
              />
            </div>

            <div className="p-5 bg-content2 w-72 rounded-xl mt-4">
              <h2 className="text-sm">
                Status: <span className="font-semibold">{data?.notes_by_pk?.status.toUpperCase()}</span>
              </h2>
              <h2 className="text-sm">
                Last Updated: <span className="font-semibold">{moment(data?.notes_by_pk?.updated_at).fromNow()}</span>
              </h2>
            </div>
            <div className="p-5 bg-content2 w-72 rounded-xl mt-4">
              <h2 className="text-sm">Shared with classrooms: </h2>
              {data?.notes_by_pk?.classroom_notes.length > 0 ? (
                <ul className="list-disc list-inside mt-1">
                  {data?.notes_by_pk?.classroom_notes.map((classroom) => (
                    <li key={classroom.classroom.name} className="text-xs">
                      <Link href={`/classroom/${classroom.classroom.id}`} className="underline">
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
            {user.sub === data?.notes_by_pk?.owner_data.id && (
              <div className="p-5 bg-content2 w-72 rounded-xl mt-4">
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
