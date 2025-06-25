"use client";
import React from "react";
import axios from "@lib/axios";
import Loading from "@components/common/loading";
import TinyEditor from "@components/common/editor";
import { Input, Button, Select, SelectItem, Alert } from "@heroui/react";

// import { CREATE_NOTE } from "@graphql/mutations";
// import { GET_CLASSROOM_NAMES } from "@graphql/queries";
// import { useQuery, useMutation } from "@apollo/client";
import { redirect } from "next/navigation";

export default function NoteCreateMainComponent({ userInfo }) {
  const editorRef = React.useRef(null);
  const [classroomNames, setClassroomNames] = React.useState([]);
  const [classroomNamesLoading, setClassroomNamesLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
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
      const { data: res } = await axios.get(`/v1/classroom/names/${userInfo._id}`);
      setClassroomNames(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load classroom names");
    }
    setClassroomNamesLoading(false);
  }, [userInfo._id]);

  React.useEffect(() => {
    fetchClassroomNames();
  }, [fetchClassroomNames]);

  // initiate mutations
  // const [createNote] = useMutation(CREATE_NOTE);

  // create note
  const handleCreateNote = async (status) => {
    setLoading(status);
    console.log(classrooms);

    try {
      // const { data } = await createNote({
      //   variables: {
      //     title,
      //     content,
      //     status: status,
      //     classroom_ids: classrooms,
      //   },
      // });

      const { data } = await axios.post("/v1/note/create", {
        title,
        content,
        status: status,
        classroom_ids: classrooms,
      });

      if (data.status === "success") {
        setSuccess(data.message);
        setTitle("");
        setContent("");
        setClassrooms([]);

        // redirect the user to the note
        window.location.href = `/note/${data.id}`;
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

  if (classroomNamesLoading) return <Loading />;

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

      {success && <Alert color="success" className="mb-5" title={success} onClose={() => setSuccess(null)} />}
      <div>
        <div className="my-4">
          <Input label="Note Title" className="w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <TinyEditor
            onInit={(evt, editor) => (editorRef.current = editor)}
            init={{
              height: 750,
              menubar: true,
              branding: false,
              toolbar:
                "undo redo | fontselect fontsizeselect | bold italic underline strikethrough | forecolor backcolor | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | link image table codesample emoticons | removeformat",
              content_style: "body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; }",
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
            initialValue="<p>This is the initial content of the editor</p>"
            value={content}
            onChange={(content) => setContent(content)}
            suppressHydrationWarning
          />
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
                    handleCreateNote("draft");
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
                    handleCreateNote("published");
                  }}
                >
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
