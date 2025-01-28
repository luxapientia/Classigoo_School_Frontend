"use client";

import React from "react";
import TinyEditor from "@components/common/editor";
import {
  Button,
  Select,
  SelectItem,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export default function ClassroomHomeEditor({
  user,
  loading,
  content,
  setContent,
  type,
  setType,
  audience,
  pubAt,
  setPubAt,
  files,
  setFiles,
  status,
  setStatus,
  deleting,
  writting,
  setWritting,
  setOpenPicker,
  setFilePicker,
  handleCreatePost,
  handleRemoveFile,
}) {
  const editorRef = React.useRef(null);

  const POST_TYPES = [
    { key: "thread", label: "Thread" },
    { key: "announcement", label: "Announcement" },
  ];

  const AUDIENCES = [
    { key: "all", label: "All" },
    { key: "custom", label: "Custom" },
  ];

  return (
    <>
      {!writting ? (
        <div className="p-5 shadow-lg rounded-2xl dark:bg-gray-800 cursor-pointer" onClick={() => setWritting(true)}>
          <div className="flex">
            <div className="flex-initial">
              <Avatar
                size="md"
                isBordered
                className="cursor-pointer"
                src={user?.user?.avatar}
                name={user?.user?.name}
              />
            </div>
            <div className="flex-auto grid content-center">
              <h4 className="text-sm font-exo text-gray-700 dark:text-gray-200 italic px-5 text-left">
                Post something to your classroom or make an announcement
              </h4>
            </div>
            <div className="flex-initial grid content-center">
              <Icon icon="akar-icons:edit" className="w-6 h-6 text-gray-700 dark:text-gray-200 cursor-pointer" />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 shadow-lg rounded-2xl dark:bg-gray-800">
          <h3 className="text-lg font-exo font-medium text-gray-700 dark:text-gray-200 mb-5">
            <span className="">Create a Post / Announcement</span>
          </h3>
          <TinyEditor
            onInit={(evt, editor) => (editorRef.current = editor)}
            init={{
              menubar: false,
              toolbar: "bold italic underline | bullist numlist | link image | removeformat",
              toolbar_location: "bottom",
              height: 200,
              autoresize_bottom_margin: 50,
            }}
            initialValue="<p>This is the initial content of the editor</p>"
            value={content}
            onChange={(content) => setContent(content)}
          />
          <div className="flex flex-col gap-2 my-3">
            {files.map((file, index) => {
              if (file.type === "image") {
                return (
                  <div
                    key={index}
                    className="flex relative w-full bg-content2 rounded-xl overflow-hidden border-3 dark:border-gray-700"
                  >
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 grid justify-center content-center flex-initial">
                      <img src={`${process.env.CLASSROOM_CDN_URL}/${file.location}`} className="w-full h-full" alt="" />
                    </div>
                    <div className="flex-auto px-5 py-4 h-full">
                      <p className="text-sm text-gray-700 dark:text-gray-200">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">{file?.size}</p>
                    </div>
                    <div className="flex-initial">
                      <Button
                        variant="text"
                        className="w-12 h-20 grid justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-none"
                        onPress={() => handleRemoveFile([file.location])}
                        isLoading={deleting}
                      >
                        {!deleting && <Icon icon="line-md:close" className="text-gray-500 w-6 h-6" />}
                      </Button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    className="flex relative w-full bg-content2 rounded-xl overflow-hidden border-3 dark:border-gray-700"
                  >
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 grid justify-center content-center flex-initial">
                      <Icon icon="tabler:file" className="w-8 h-8 text-gray-800 dark:text-gray-200" />
                    </div>
                    <div className="flex-auto px-5 py-4 h-full">
                      <p className="text-sm text-gray-700 dark:text-gray-200">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">{file?.size}</p>
                    </div>
                    <div className="flex-initial">
                      <Button
                        variant="text"
                        className="w-12 h-20 grid justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-none"
                        onPress={() => handleRemoveFile([file.location])}
                        isLoading={deleting}
                      >
                        {!deleting && <Icon icon="line-md:close" className="text-gray-500 w-6 h-6" />}
                      </Button>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <div className="flex gap-2 my-3">
            <Button
              variant="text"
              className="w-12 h-12 bg-gray-200 hover:outline-2 hover:outline-gray-700 text-sm rounded-full p-0 min-w-0"
              onPress={() => setFilePicker("image")}
            >
              <Icon icon="tabler:photo-plus" className="w-6 h-6 text-gray-800" />
            </Button>
            <Button
              variant="text"
              className="w-12 h-12 bg-gray-200 hover:outline-2 hover:outline-gray-700 text-sm rounded-full p-0 min-w-0"
              onPress={() => setFilePicker("file")}
            >
              <Icon icon="tabler:file-plus" className="w-6 h-6 text-gray-800" />
            </Button>
          </div>
          <div className="flex justify-between">
            <div className="flex-initial flex gap-2 max-w-[100%] w-[500px]">
              <Select
                className="w-[250px] mr-2 flex-1"
                label="Post Type"
                placeholder="Thread"
                selectionMode="single"
                value={"announcement"}
                selectedKeys={[type]}
                onChange={(e) => setType(e.target.value)}
              >
                <SelectItem key={"thread"}>Thread</SelectItem>
                <SelectItem key={"announcement"}>Announcement</SelectItem>
              </Select>
              <div
                className="flex-1  bg-content2 hover:bg-gray-200 dark:hover:bg-neutral-700 p-3 rounded-xl h-full relative cursor-pointer"
                onClick={() => setOpenPicker(true)}
              >
                <label className="text-xs text-gray-600 dark:text-neutral-300 absolute top-2">Audience</label>
                <p className="text-small pt-3">
                  {audience.length === 0 ? "Teachers" : audience[0] == "*" ? "All" : "Custom"}
                </p>
              </div>
            </div>
            <div className="flex-initial grid content-center">
              <div className="flex gap-0.5">
                <Button
                  variant="text"
                  size="lg"
                  onPress={async () => {
                    const fileLocs = files.map((f) => f.location);
                    await handleRemoveFile(fileLocs);
                    setFiles([]);
                    setWritting(false);
                  }}
                  className="w-20 h-10 bg-gray-500 hover:bg-gray-600 text-sm text-white rounded-lg mr-2"
                >
                  Cancle
                </Button>
                <Button
                  variant="text"
                  // size="lg"
                  onPress={handleCreatePost}
                  isLoading={loading}
                  // isLoading
                  className="bg-primary text-sm text-white rounded-lg px-4"
                >
                  Publish
                </Button>
                {/* <Button
                  variant="text"
                  // size="lg"
                  onPress={handleCreatePost}
                  isLoading={loading}
                  // isLoading
                  className="bg-primary text-sm text-white rounded-lg rounded-r-none px-4"
                >
                  Publish
                </Button>
                <Dropdown>
                  <DropdownTrigger>
                    <div className="w-10 h-10 rounded-lg bg-primary rounded-l-none grid justify-center content-center">
                      <Icon icon="meteor-icons:chevron-down" className="w-4 h-4 text-white" />
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Dynamic Actions">
                    <DropdownItem key="schedule">Schedule for later</DropdownItem>
                  </DropdownMenu>
                </Dropdown> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
