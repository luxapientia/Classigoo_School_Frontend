import xss from "xss";
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
import DeleteCommentAction from "./delete-comment-action";

//  mutations
import { useMutation } from "@apollo/client";
import { DELETE_COMMENT } from "@graphql/mutations";
import ViewAllComments from "./all-comments";

export default function PostsSingle({
  post = {},
  user,
  comment,
  canPost,
  setError,
  setSuccess,
  setComment,
  setToDelete,
  openComment,
  handleComment,
  commentLoading,
  handleCommentChange,
}) {
  const [comments, setComments] = React.useState([]);
  const [fetching, setFetching] = React.useState(false);
  const [allComments, setAllComments] = React.useState(null);
  const [toDeleteComment, setToDeleteComment] = React.useState(null);
  const [commentDeleteLoading, setCommentDeleteLoading] = React.useState(null);

  // graphql
  const [deleteComment] = useMutation(DELETE_COMMENT);

  // handle all comments close
  const handleAllCommentsClose = () => {
    setAllComments(null);
  };

  // handle delete comment
  const handleDeleteComment = async (id) => {
    setCommentDeleteLoading(true);
    try {
      setError("");
      setSuccess("");
      const deleted = await deleteComment({
        variables: {
          cid: id,
        },
      });

      if (deleted?.data.delete_classroom_post_comments_by_pk.id) {
        setToDeleteComment(null);
        setSuccess("Comment deleted successfully.");
      } else {
        setToDeleteComment(null);
        setError(
          deleted?.data?.delete_classroom_post_comments_by_pk.errors[0]
            .message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      // console.log(error);
      setToDeleteComment(null);
      setError("Something went wrong. Please try again.");
    }

    setCommentDeleteLoading(false);
  };

  // auto fetch
  // React.useEffect(() => {
  //   if (allComments) {
  //     handleAllCommentsFetch(allComments);
  //     console.log("fetching");
  //     console.log(comments);
  //   }
  // }, [allComments]);

  return (
    <>
      {toDeleteComment && (
        <DeleteCommentAction
          loading={commentDeleteLoading}
          handleClose={() => setToDeleteComment(null)}
          handleSubmit={() => handleDeleteComment(toDeleteComment)}
        />
      )}
      {allComments && (
        <ViewAllComments
          user={user}
          post_id={allComments}
          handleClose={handleAllCommentsClose}
          handleDeleteComment={setToDeleteComment}
        />
      )}
      <div
        key={post.id}
        className="shadow-lg rounded-2xl dark:bg-gray-800 my-5 overflow-hidden"
      >
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
                  <p className="text-gray-500">
                    {moment(post.created_at).format("Do MMMM YYYY, h:mm a")}
                  </p>
                }
              />
            </div>
            <div className="flex-initial">
              {post.user.id === user.user.id ||
              user.role === "owner" ||
              user.role === "teacher" ? (
                <Dropdown>
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
            <article
              className="prose max-w-none prose-lg prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-md prose-ul:list-disc prose-ol:list-decimal prose-table:border-collapse prose-table:border prose-table:border-gray-300 prose-th:border prose-th:p-2 prose-th:bg-gray-100 prose-td:border prose-td:p-2 prose-td:text-gray-700 prose-strong:text-gray-800 dark:prose-headings:text-gray-100 dark:prose-p:text-gray-300 dark:prose-a:text-blue-400 dark:prose-blockquote:border-gray-600 dark:prose-th:bg-gray-800 dark:prose-td:text-gray-300 dark:prose-table:border-gray-600 dark:prose-strong:text-gray-100"
              dangerouslySetInnerHTML={{ __html: xss(post.content) }}
            ></article>
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
                        <p className="text-sm text-gray-700 dark:text-gray-200">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">
                          {file?.size}
                        </p>
                      </div>
                      <div className="flex-initial">
                        <Link
                          // variant="text"
                          download
                          className="w-16 h-20 grid justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-none"
                          href={`${process.env.CLASSROOM_CDN_URL}/${file.location}`}
                        >
                          <Icon
                            icon="si:file-download-duotone"
                            className="text-gray-500 w-6 h-6"
                          />
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
                        <Icon
                          icon="tabler:file"
                          className="w-8 h-8 text-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div className="flex-auto px-5 py-4 h-full">
                        <p className="text-sm text-gray-700 dark:text-gray-200">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">
                          {file?.size}
                        </p>
                      </div>
                      <div className="flex-initial">
                        <Link
                          // variant="text"
                          download
                          className="w-16 h-20 grid justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-none"
                          href={`${process.env.CLASSROOM_CDN_URL}/${file.location}`}
                        >
                          <Icon
                            icon="si:file-download-duotone"
                            className="text-gray-500 w-6 h-6"
                          />
                        </Link>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}

          {post.comments_aggregate.aggregate.count > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-5 text-right">
              <strong>{post.comments_aggregate.aggregate.count}</strong> comment
              {post.comments_aggregate.count > 1 && "s"}
            </p>
          )}
        </div>
        {post.type !== "announcement" && canPost && (
          <div className="p-5 bg-slate-100 dark:bg-slate-700">
            <div className="flex gap-4">
              <div className="flex-intial mt-1">
                <Avatar
                  isBordered
                  src={user.user.avatar}
                  name={user.user.name}
                  size="sm"
                />
              </div>
              <div className="flex-auto w-full">
                {openComment === post.id ? (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 border-2 border-gray-200 dark:border-gray-700">
                    <Textarea
                      placeholder="Write a comment"
                      className="w-full"
                      onChange={(e) => setComment(e.target.value)}
                      value={comment}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="solid"
                        size="sm"
                        color="danger"
                        className="mr-2"
                        onPress={() => handleCommentChange(null)}
                        isDisabled={commentLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="solid"
                        size="sm"
                        color="primary"
                        onPress={() => handleComment(post.id)}
                        isLoading={commentLoading}
                      >
                        Comment
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => handleCommentChange(post.id)}
                    className="bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 border-2 border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Write a comment as <strong>{post.user.name}</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {post.comments?.map((comment, index) => (
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

                    <div className="flex-initial">
                      <Dropdown>
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
                          {comment.user.id === user.user.id ||
                          user.role === "owner" ||
                          user.role === "teacher" ||
                          post.user.id === user.user.id ? (
                            <DropdownItem>
                              <button
                                className=""
                                onClick={() => setToDeleteComment(comment.id)}
                              >
                                <p className="flex items-center text-danger-500">
                                  <Icon
                                    icon="bi:trash"
                                    className="w-4 h-4 mr-2"
                                  />
                                  Delete
                                </p>
                              </button>
                            </DropdownItem>
                          ) : null}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {post.comments_aggregate.aggregate.count > 1 && (
              // show all comments
              <button
                className="text-xs text-gray-500 dark:text-gray-400 mt-2 w-full grid justify-center"
                onClick={() => setAllComments(post.id)}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  View all {post.comments_aggregate.aggregate.count} comments
                </p>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
