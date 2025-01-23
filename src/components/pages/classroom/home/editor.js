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

export default function ClassroomHomeEditor({ user }) {
  const editorRef = React.useRef(null);
  const [writting, setWritting] = React.useState(false);

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
          />
          .
          <div className="flex justify-between">
            <div className="flex-initial">
              <Select className="w-[250px] mr-2" label="Post Type" placeholder="Thread">
                <SelectItem key={"thread"}>Thread</SelectItem>
                <SelectItem key={"announcement"}>Announcement</SelectItem>
              </Select>
              <Select className="w-[250px]" label="Choose Audience" placeholder="All">
                <SelectItem key={"all"}>All</SelectItem>
                <SelectItem key={"custom"}>Custom</SelectItem>
              </Select>
            </div>
            <div className="flex-initial grid content-center">
              <div className="flex gap-0.5">
                <Button
                  variant="text"
                  size="lg"
                  onPress={() => setWritting(false)}
                  className="w-20 h-10 bg-gray-500 hover:bg-gray-600 text-sm text-white rounded-lg mr-2"
                >
                  Cancle
                </Button>
                <Button
                  variant="text"
                  size="lg"
                  // onPress={log}
                  className="w-20 h-10 bg-primary text-sm text-white rounded-lg rounded-r-none"
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
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
