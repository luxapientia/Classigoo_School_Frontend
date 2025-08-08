"use client";
import React from "react";
import axios from "@lib/axios";
import { Icon } from "@iconify/react";
import NotFoundPage from "@app/not-found";
import { useRouter } from "nextjs-toploader/app";
import Loading from "@components/common/loading";
import TinyEditor from "@components/common/editor";
import { Input, Button, Select, SelectItem, Alert } from "@heroui/react";

// import { EDIT_NOTE } from "@graphql/mutations";
// import { GET_NOTE, GET_CLASSROOM_NAMES } from "@graphql/queries";
// import { useQuery, useMutation } from "@apollo/client";

export default function NoteEditMainComponent({ userInfo, id }) {
  const router = useRouter();
  const editorRef = React.useRef(null);
  const [classroomNames, setClassroomNames] = React.useState([]);
  const [classroomNamesLoading, setClassroomNamesLoading] = React.useState(false);
  const [note, setNote] = React.useState(null);
  const [noteLoading, setNoteLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("loading...........");
  const [classrooms, setClassrooms] = React.useState([]);

  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // get classrooms
  // const {
  //   data: classroomData,
  //   loading: classroomLoading,
  //   error: classroomError,
  // } = useQuery(GET_CLASSROOM_NAMES, {
  //   variables: {
  //     uid: user.sub,
  //   },
  // });

  // get classroom names
  const fetchClassroomNames = React.useCallback(async () => {
    setClassroomNamesLoading(true);
    try {
      const { data: res } = await axios.get(`/v1/classroom/names/${userInfo.id}`);
      setClassroomNames(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load classroom names");
    }
    setClassroomNamesLoading(false);
  }, [userInfo.id]);

  React.useEffect(() => {
    fetchClassroomNames();
  }, [fetchClassroomNames]);

  // const {
  //   data: noteData,
  //   loading: noteLoading,
  //   error: noteError,
  // } = useQuery(GET_NOTE, {
  //   variables: {
  //     id,
  //   },
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

  // initiate mutations
  // const [editNote] = useMutation(EDIT_NOTE);

  // edit note
  const handleEditNote = async (status) => {
    setLoading(status);

    try {
      // const { data } = await editNote({
      //   variables: {
      //     id,
      //     title,
      //     content,
      //     status: status,
      //     classroom_ids: classrooms,
      //   },
      // });

      const { data } = await axios.post("/v1/note/update", {
        id,
        title,
        content,
        status,
        classroom_ids: classrooms,
      });

      if (data.status === "success") {
        setSuccess(data.message);
        // setTitle("");
        // setContent("");
        // setClassrooms([]);

        // redirect the user to the note
        // window.location.href = `/note/${data.id}`;
        router.push(`/note/${data.id}`);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

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

  React.useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setClassrooms(
        note.classroom_notes.map(
          ({ classroom }) => classroom.id
        )
      );
    }
  }, [note]);

  if (classroomNamesLoading || noteLoading) return <Loading />;
  if (note === null) return <NotFoundPage />;
  if (userInfo.id !== note.owner_data.id) return <NotFoundPage />;

  return (
    <div>
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
      <div>
        <div className="my-4">
          <Input
            label="Note Title"
            className="w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          {content !== "loading..........." ? (
            <TinyEditor
              onInit={(evt, editor) => (editorRef.current = editor)}
              init={{
                height: 750,
                menubar: true,
                branding: false,
                toolbar:
                  "undo redo | fontselect fontsizeselect | bold italic underline strikethrough | forecolor backcolor | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | link image table codesample emoticons | removeformat",
                content_style:
                  "body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; }",
                // autosave_ask_before_unload: true,
                // autosave_interval: "30s",
                // autosave_prefix: "classigoo-note-autosave-{path}{query}-{id}-",
                // autosave_restore_when_empty: true,
                paste_data_images: true,
                image_uploadtab: true,
                quickbars_insert_toolbar: false,
                menu: {
                  view: {
                    title: "View",
                    items: "visualaid visualblocks visualchars fullscreen",
                  },
                  tools: {
                    title: "Tools",
                    items: "wordcount",
                  },
                },
                file_picker_callback: function (callback, value, meta) {
                  const input = document.editElement("input");
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
              // initialValue={note.content}
              value={content}
              onChange={(content) => setContent(content)}
              // onChange={(content) => void 0}
              suppressHydrationWarning
            />
          ) : (
            <div className="border-2 rounded-xl border-gray-300 h-48 border-dashed grid content-center justify-center">
              <Icon
                icon="eos-icons:three-dots-loading"
                className="text-success-500 text-5xl"
              />
            </div>
          )}
        </div>
        <div className="my-5 flex flex-col lg:flex-row gap-5">
          <div className="flex-1 grid items-center">
            <Select
              label="Select Classroom"
              selectionMode="multiple"
              selectedKeys={classrooms}
              onChange={(e) => setClassrooms(e.target.value.split(","))}
              items={
                classroomNames?.map(({ classroom }) => ({
                  key: classroom.id,
                  label: classroom.name,
                })) || []
              }
            >
              {classroomNames?.map(({ classroom }) => (
                <SelectItem key={classroom.id}>{classroom.name}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex-1">
            <div className="my-5 grid items-center">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="text"
                  isLoading={loading === "draft"}
                  isDisabled={loading === "published"}
                  className="bg-primary-500 text-background rounded-none font-medium w-full lg:w-auto"
                  onPress={() => {
                    handleEditNote("draft");
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="text"
                  isLoading={loading === "published"}
                  isDisabled={loading === "draft"}
                  className="bg-black dark:bg-white text-background rounded-none font-medium w-full lg:w-auto"
                  onPress={() => {
                    handleEditNote("published");
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
  );
}
