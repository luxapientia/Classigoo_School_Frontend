"use client";

import React from "react";
import moment from "moment";
import { Icon } from "@iconify/react";
import {
  Avatar,
  AvatarGroup,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Textarea,
  User,
} from "@heroui/react";
import Link from "next/link";

// delete post mutation
import { DELETE_POST } from "@graphql/mutations";
import { useMutation } from "@apollo/client";
import DeleteAction from "./delete-action";

export default function ClassroomPost({ posts = [], user, canPost, handleDeleteFile, setSuceess, setError }) {
  // states
  const [openComment, setOpenComment] = React.useState(null);
  const [toDelete, setToDelete] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // graphql
  const [deletePost] = useMutation(DELETE_POST);

  // delete post
  const handleDeletePost = async (id) => {
    try {
      setError("");
      setSuceess("");
      setDeleteLoading(true);
      const deleted = await deletePost({
        variables: { id },
      });

      if (deleted?.data.delete_classroom_posts_by_pk.id) {
        // get the file id to make arrray
        const post = posts.find((p) => p.id === id);

        if (post.files.length > 0) {
          let fileIds = post.files.map((f) => f.id);
          handleDeleteFile(fileIds);
        }

        setToDelete(null);
        setSuceess("Post deleted successfully.");
      } else {
        setToDelete(null);
        setError(
          deleted?.data?.delete_classroom_posts_by_pk.errors[0].message || "Something went wrong. Please try again."
        );
      }

      setDeleteLoading(false);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      {/* delete post modal */}
      {toDelete && (
        <DeleteAction
          loading={deleteLoading}
          error={null}
          handleClose={() => setToDelete(null)}
          handleSubmit={() => handleDeletePost(toDelete)}
        />
      )}
      <div>
        {posts?.map((post) => (
          <div key={post.id} className="shadow-lg rounded-2xl dark:bg-gray-800 my-5 overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between">
                <div className="flex-initial">
                  <User
                    avatarProps={{
                      size: "md",
                      isBordered: true,
                      className: "cursor-pointer mr-1",
                      src: post.user.avatar,
                      name: post.user.name,
                    }}
                    name={post.user.name}
                    description={
                      <p className="text-gray-500">{moment(post.created_at).format("Do MMMM YYYY, h:mm a")}</p>
                    }
                  />
                </div>
                <div className="flex-initial">
                  {post.user.id === user.user.id || user.role === "owner" || user.role === "teacher" ? (
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="text" className="grid justify-center items-center p-0" isIconOnly>
                          <Icon icon="bi:three-dots-vertical" className="text-gray-500 w-5 h-5" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        {/* <DropdownItem>
                          <p className="flex items-center">
                            <Icon icon="bi:pencil-square" className="text-gray-500 w-4 h-4 mr-2" />
                            Edit
                          </p>
                        </DropdownItem> */}
                        <DropdownItem>
                          <button className="" onClick={() => setToDelete(post.id)}>
                            <p className="flex items-center text-danger-500">
                              <Icon icon="bi:trash" className="w-4 h-4 mr-2" />
                              Delete
                            </p>
                          </button>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  ) : null}
                </div>
              </div>

              <div className="mt-5">
                <div
                  className="prose prose-lg prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-semibold prose-p:leading-relaxed prose-a:text-blue-600 prose-a:underline prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-img:rounded-lg prose-img:w-full prose-img:shadow-sm"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>
              </div>

              {post.files.length > 0 && (
                <div className="pt-5 flex flex-col gap-4">
                  {post.files.map((file, index) => {
                    if (file.type === "image") {
                      return (
                        <div
                          key={index}
                          className="flex relative w-full bg-content2 rounded-xl overflow-hidden border-3 dark:border-gray-700"
                        >
                          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 grid justify-center content-center flex-initial">
                            <img
                              src={`${process.env.CLASSROOM_CDN_URL}/${file.location}`}
                              className="w-full h-full"
                              alt=""
                            />
                          </div>
                          <div className="flex-auto px-5 py-4 h-full">
                            <p className="text-sm text-gray-700 dark:text-gray-200">{file.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">{file?.size}</p>
                          </div>
                          <div className="flex-initial">
                            <Link
                              // variant="text"
                              download
                              className="w-16 h-20 grid justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-none"
                              href={`${process.env.CLASSROOM_CDN_URL}/${file.location}`}
                            >
                              <Icon icon="si:file-download-duotone" className="text-gray-500 w-6 h-6" />
                            </Link>
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
                            <Link
                              // variant="text"
                              download
                              className="w-16 h-20 grid justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-none"
                              href={`${process.env.CLASSROOM_CDN_URL}/${file.location}`}
                            >
                              <Icon icon="si:file-download-duotone" className="text-gray-500 w-6 h-6" />
                            </Link>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
            {post.type !== "announcement" && canPost && (
              <div className="p-5 bg-slate-100 dark:bg-slate-700">
                <div className="flex gap-4">
                  <div className="flex-intial mt-1">
                    <Avatar isBordered src={post.user.avatar} name={post.user.name} size="sm" />
                  </div>
                  <div className="flex-auto w-full">
                    {openComment === post.id ? (
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 border-2 border-gray-200 dark:border-gray-700">
                        <Textarea
                          placeholder="Write a comment"
                          className="w-full"
                          onChange={(e) => console.log(e.target.value)}
                        />
                        <div className="flex justify-end mt-2">
                          <Button
                            variant="solid"
                            size="sm"
                            color="danger"
                            className="mr-2"
                            onPress={() => setOpenComment(null)}
                          >
                            Cancel
                          </Button>
                          <Button variant="solid" size="sm" color="primary">
                            Comment
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => setOpenComment(post.id)}
                        className="bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 border-2 border-gray-200 dark:border-gray-700"
                      >
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Write a comment as <strong>{post.user.name}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
