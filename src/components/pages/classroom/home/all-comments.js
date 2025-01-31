"use client";
import moment from "moment";
import React from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { useSubscription } from "@apollo/client";
import { SUB_GET_COMMENTS } from "@graphql/subscriptions";

export default function ViewAllComments({
  user,
  post_id,
  handleClose,
  handleDeleteComment,
}) {
  // fetch comments
  const { data, loading, error } = useSubscription(SUB_GET_COMMENTS, {
    variables: {
      pid: post_id,
    },
  });

  const bodyRef = useDetectClickOutside({ onTriggered: handleClose });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-5 z-[500]">
      <div
        className="p-5 bg-slate-100 dark:bg-slate-700 rounded-xl max-w-[calc(100%_-_20px)] w-[750px] max-h-[calc(100%_-_50px)] overflow-y-auto relative"
        ref={bodyRef}
      >
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <>
            <div className="absolute top-1.5 right-1.5 p-2">
              <Button
                variant="text"
                isIconOnly
                onPress={handleClose}
                className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                <Icon icon="bi:x-lg" className="w-4 h-4" />
              </Button>
            </div>
            <h4 className="text-xl text-gray-700 dark:text-gray-200 font-semibold">
              All Comments
            </h4>

            {data?.classroom_post_comments?.map((comment, index) => (
              <div key={index} className="flex gap-4 mt-4">
                <div className="flex-initial mt-1">
                  <Avatar
                    isBordered
                    src={comment.user.avatar}
                    name={comment.user.name}
                    size="sm"
                  />
                </div>
                <div className="flex-auto w-full">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 border-2 border-gray-200 dark:border-gray-700 flex justify-between">
                    <div className="">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <strong>{comment.user.name}</strong> commented{" "}
                        {moment(comment.created_at).fromNow()}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-200 mt-2">
                        {comment.content}
                      </p>{" "}
                    </div>

                    {comment.user.id === user.user.id ||
                    user.role === "owner" ||
                    user.role === "teacher" ||
                    post.user.id === user.user.id ? (
                      <div className="flex-initial">
                        <button
                          className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-full grid justify-center items-center h-full w-12 text-center"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Icon
                            icon="bi:trash"
                            className="w-4 h-4 text-danger-500"
                          />
                        </button>

                        {/* <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="text"
                        className="grid justify-center items-center p-0"
                        isIconOnly
                      >
                        <Icon
                          icon="bi:three-dots-vertical"
                          className="text-gray-500 w-5 h-5"
                        />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      {/* {comment.user.id === user.user.id && (
                          <DropdownItem>
                            <p className="flex items-center">
                              <Icon
                                icon="bi:pencil-square"
                                className="text-gray-500 w-4 h-4 mr-2"
                              />
                              Edit
                            </p>
                          </DropdownItem>
                        )} */}
                        {/* {comment.user.id === user.user.id ||
                      user.role === "owner" ||
                      user.role === "teacher" ||
                      post.user.id === user.user.id ? ( */}
                        {/* <DropdownItem>
                          <button
                            className=""
                            onClick={() => console.log("delete comment")}
                          >
                            <p className="flex items-center text-danger-500">
                              <Icon icon="bi:trash" className="w-4 h-4 mr-2" />
                              Delete
                            </p>
                          </button>
                        </DropdownItem>
                      ) : null}
                    </DropdownMenu>
                  </Dropdown> } */}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
