"use client";

import React from "react";

import PostsSingle from "./posts-single";
import DeletePostAction from "./delete-post-action";
import UndoCommentAction from "./undo-comment-action";

//  graphql
import { useMutation } from "@apollo/client";
import { DELETE_POST, ADD_COMMENT } from "@graphql/mutations";

export default function ClassroomPost({
  posts = [],
  user,
  canPost,
  setError,
  setSuccess,
  classroom_id,
  handleDeleteFile,
}) {
  // states
  const [openComment, setOpenComment] = React.useState(null);
  const [toDelete, setToDelete] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [commentLoading, setCommentLoading] = React.useState(false);
  const [commentUndo, setCommentUndo] = React.useState(null);

  // graphql
  const [deletePost] = useMutation(DELETE_POST);
  const [addComment] = useMutation(ADD_COMMENT);

  // delete post
  const handleDeletePost = async (id) => {
    try {
      setError("");
      setSuccess("");
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
        setSuccess("Post deleted successfully.");
      } else {
        setToDelete(null);
        setError(
          deleted?.data?.delete_classroom_posts_by_pk.errors[0].message ||
            "Something went wrong. Please try again."
        );
      }

      setDeleteLoading(false);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleCommentChange = (v) => {
    if (!commentLoading) {
      if (!v) {
        // check if the comment is empty
        if (comment) {
          setCommentUndo(openComment);
          return;
        } else {
          setComment("");
          setOpenComment(v);
          setCommentUndo(null);
          return;
        }
      } else if (v && !openComment) {
        setComment("");
        setOpenComment(v);
        setCommentUndo(null);
        return;
      } else {
        if (comment) {
          setCommentUndo(v);
        } else {
          setOpenComment(v);
        }
        return;
      }
    } else {
      return;
    }
  };

  // handle comment
  const handleComment = async (post_id) => {
    setCommentLoading(true);

    try {
      setError("");
      setSuccess("");
      const commented = await addComment({
        variables: {
          cid: classroom_id,
          pid: post_id,
          content: comment,
        },
      });

      if (commented?.data?.addClassroomPostComment?.status) {
        setComment("");
        setSuccess("Comment added successfully.");
      } else {
        setError(
          commented?.data?.addClassroomPostComment?.message ||
            "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.log("error", error);
      setError("Something went wrong. Please try again.");
    }

    setCommentLoading(false);
  };

  return (
    <div>
      {/* delete post modal */}
      {toDelete && (
        <DeletePostAction
          loading={deleteLoading}
          error={null}
          handleClose={() => setToDelete(null)}
          handleSubmit={() => handleDeletePost(toDelete)}
        />
      )}

      {
        // undo comment modal
        commentUndo && (
          <UndoCommentAction
            error={null}
            loading={commentLoading}
            handleClose={() => setCommentUndo(null)}
            handleSubmit={() => {
              setOpenComment((prev) =>
                prev === commentUndo && comment ? null : commentUndo
              );
              setCommentUndo(null);
              setComment("");
            }}
          />
        )
      }

      <div>
        {posts?.map((post) => (
          <PostsSingle
            key={post.id}
            post={post}
            user={user}
            canPost={canPost}
            comment={comment}
            setError={setError}
            setSuccess={setSuccess}
            setComment={setComment}
            setToDelete={setToDelete}
            openComment={openComment}
            classroom_id={classroom_id}
            handleComment={handleComment}
            commentLoading={commentLoading}
            handleCommentChange={handleCommentChange}
          />
        ))}
      </div>
    </div>
  );
}
