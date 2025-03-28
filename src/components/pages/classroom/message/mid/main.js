"use client";
import axios from "axios";
import React from "react";
import cn from "classnames";
import moment from "moment";
import Link from "next/link";
import { Icon } from "@iconify/react";
import NotFoundPage from "@app/not-found";
import { useRouter } from "nextjs-toploader/app";
import Loading from "@components/common/loading";
import { FileUploader } from "react-drag-drop-files";
import { HeaderSlot } from "@components/layout/header";
import { Avatar, Alert, Button, Textarea } from "@heroui/react";

import { GET_ROOM_MESSAGES } from "@graphql/queries";
import { START_CHAT, SEND_MESSAGE, DELETE_MESSAGE } from "@graphql/mutations";
import { useLazyQuery, useSubscription, useMutation } from "@apollo/client";
import {
  SUB_GET_CLASSROOM,
  SUB_LIST_MESSAGE_RECEIPIENTS,
  SUB_GET_ROOM_LATEST_MESSAGE,
  SUB_GET_ROOM_MESSAGES,
} from "@graphql/subscriptions";
import DeleteMessageAction from "./delete-action";

export default function ClassroomMessageSingle({ cid, mid, user }) {
  const router = useRouter();
  const [text, setText] = React.useState("");
  const [dates, setDates] = React.useState([]);
  const [limit, setLimit] = React.useState(20);
  const [offset, setOffset] = React.useState(0);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [sending, setSending] = React.useState(false);
  const [fLoaded, setFLoaded] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);
  const [messageIds, setMessageIds] = React.useState([]);
  const [receipients, setReceipients] = React.useState([]);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [newRecipients, setNewRecipients] = React.useState([]);
  const [limitReached, setLimitReached] = React.useState(false);
  const [loadingNewConversation, setLoadingNewConversation] = React.useState(false);

  // file states
  const [filePicker, setFilePicker] = React.useState(false);
  const [tempFile, setTempFile] = React.useState(null);
  const [tempFilePreview, setTempFilePreview] = React.useState(null);
  const [fileError, setFileError] = React.useState(null);
  const imageTypes = ["png", "jpg", "jpeg", "gif", "webp"];

  const scrollRef = React.useRef(null);

  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_GET_CLASSROOM, {
    variables: { id: cid },
  });

  const {
    data: sub_data_message_receipients,
    loading: sub_loading_message_receipients,
    error: sub_error_message_receipients,
  } = useSubscription(SUB_LIST_MESSAGE_RECEIPIENTS, {
    variables: { cid },
  });

  const {
    data: sub_data_latest_message,
    loading: sub_loading_latest_message,
    error: sub_error_latest_message,
  } = useSubscription(SUB_GET_ROOM_LATEST_MESSAGE, {
    variables: { rid: mid },
  });

  const {
    data: sub_data_message_ids,
    loading: sub_loading_message_ids,
    error: sub_error_message_ids,
  } = useSubscription(SUB_GET_ROOM_MESSAGES, {
    variables: { rid: mid },
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [deleteMessage] = useMutation(DELETE_MESSAGE);
  const [getMessages] = useLazyQuery(GET_ROOM_MESSAGES);

  React.useEffect(() => {
    if (!fLoaded) {
      const fetchMessages = async () => {
        try {
          const { data } = await getMessages({
            variables: { rid: mid, limit, offset },
          });
          setMessages(data.messages);
          if (data.messages.length < limit) {
            setLimitReached(true);
          }
          setOffset((prev) => prev + limit);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchMessages();
    }
    setFLoaded(true);
  }, []);

  React.useEffect(() => {
    if (fLoaded && sub_data_latest_message?.messages?.length > 0) {
      const newMessage = sub_data_latest_message?.messages[0];
      // dont' duplicate messages
      // if (!messageIds.includes(newMessage.id)) {
      //   setMessageIds((prev) => [newMessage.id, ...prev]);
      //   setMessages((prev) => [newMessage, ...prev]);
      //   // scroll to the top of the message list
      //   if (scrollRef.current) {
      //     scrollRef.current.scrollTop = 0;
      //   }
      // }

      if (!messages.find((m) => m.id === newMessage.id)) {
        setMessages((prev) => [newMessage, ...prev]);
        if (!messageIds.includes(newMessage.id)) {
          setMessageIds((prev) => [newMessage.id, ...prev]);
        }
        // scroll to the top of the message list
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
        }
      }
    }
  }, [sub_data_latest_message, messages, fLoaded]);

  React.useEffect(() => {
    if (fLoaded && sub_data_message_ids?.messages?.length > 0) {
      const newMessageIDs = [];
      sub_data_message_ids?.messages.forEach((m) => {
        if (!newMessageIDs.includes(m.id)) {
          newMessageIDs.push(m.id);
        }
      });
      setMessageIds(newMessageIDs);
    }
  }, [sub_data_message_ids, fLoaded]);

  React.useEffect(() => {
    if (sub_data?.classrooms_by_pk && sub_data_message_receipients) {
      let r = [];
      let u = [];

      // if type == all then name is Group Name but if single that case there will be 2 users in the array and name will be the name of other user in the array different from the current user
      sub_data_message_receipients.message_rooms.forEach((mr) => {
        //all and child only disabled
        if (mr.type === "all") {
          r.push({
            id: mr.id,
            name: mr.name,
            type: mr.type,
          });
        } else {
          r.push({
            id: mr.id,
            type: mr?.type,
            name: mr?.users?.find((u) => u?.user?.id !== user?.sub)?.user?.name,
            image: mr?.users?.find((u) => u?.user?.id !== user?.sub)?.user?.avatar,
            uid: mr?.users?.find((u) => u?.user?.id !== user?.sub)?.user?.id,
            role: mr?.users?.find((u) => u?.user?.id !== user?.sub)?.user?.role === "student" ? "student" : "teacher",
          });
        }
      });

      setReceipients(r);
    }
  }, [sub_data_message_receipients, sub_data]);

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
    if (fileError) {
      const timer = setTimeout(() => {
        setFileError(null);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [fileError]);

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

  // handle delete file
  const handleDeleteFile = async (locations) => {
    try {
      const response = await axios.post("/api/proxy/upload/posts/delete", {
        files: locations,
      });

      if (response.data.status === "success") {
        return true;
      }

      if (response.data.status === "error") {
        setFileError(response.data.message);
        return false;
      } else {
        return false;
      }
    } catch (err) {
      // console.log(err);
      setFileError(err.message);
      return false;
    }
  };

  const handleSendMessage = async () => {
    setSending(true);
    if (text.trim() === "") {
      setError("Message cannot be empty");
      setSending(false);
      return;
    }
    try {
      const { data } = await sendMessage({
        variables: {
          cid,
          rid: mid,
          msg: {
            files: [],
            type: "text",
            text: text,
          },
        },
      });
      setText("");

      if (data.sendMessage.status === "success") {
        setSuccess("Message sent successfully");
      }
      if (data.sendMessage.status === "error") {
        setError(data.sendMessage.message);
      }
    } catch (error) {
      setError(error.message);
    }
    setSending(false);
  };

  const handleDeleteMessage = async (id) => {
    setDeleting(true);
    try {
      const { data } = await deleteMessage({
        variables: { mid: id },
      });

      // if type file then also delete file from server
      const message = messages.find((m) => m.id === id);
      if (message?.content?.type === "file") {
        const fileLocations = message?.content?.files.map((f) => f.location);
        const deleteFile = await handleDeleteFile(fileLocations);
        if (!deleteFile) {
          setError("Something went wrong. Please try again.");
          setDeleting(false);
          return;
        }
      }

      if (data.delete_messages_by_pk) {
        // remove message from the state
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setSuccess("Message deleted successfully");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setError(error.message);
    }
    setDeleteId("");
    setDeleting(false);
  };

  const handleLoadMore = async () => {
    if (loadingMore || limitReached) return;
    setLoadingMore(true);
    try {
      const { data } = await getMessages({
        variables: { rid: mid, limit, offset },
      });
      setMessages((prev) => [...prev, ...data.messages]);
      if (data.messages.length < limit) {
        setLimitReached(true);
      } else {
        setLimitReached(false);
      }
      setOffset((prev) => prev + limit);
    } catch (error) {
      setError(error.message);
    }
    setLoadingMore(false);
  };

  const handleFileUpload = async () => {
    setSending(true);
    setSuccess("");
    setFileError("");
    try {
      if (!tempFile) {
        setFileError("Please select a file to upload.");
        return;
      }

      let formData = new FormData();
      formData.append("file", tempFile);

      // post form data image
      const response = await axios.post("/api/proxy/upload/posts/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      let fileSize;

      if (tempFile.size < 1024) {
        fileSize = `${tempFile.size} bytes`;
      } else if (tempFile.size >= 1024 && tempFile.size < 1048576) {
        fileSize = `${(tempFile.size / 1024).toFixed(2)} KB`;
      } else {
        fileSize = `${(tempFile.size / 1048576).toFixed(2)} MB`;
      }

      if (response.data.status === "success") {
        setSuccess("File uploaded successfully");
        const { data } = await sendMessage({
          variables: {
            cid,
            rid: mid,
            msg: {
              files: [
                {
                  name: tempFile.name,
                  type: imageTypes.includes(tempFile.type.split("/")[1]) ? "image" : "file",
                  size: fileSize,
                  location: response.data.data.location,
                },
              ],
              type: "file",
              text: "",
            },
          },
        });
        setText("");

        setTempFile(null);
        setTempFilePreview(null);
        setFilePicker(false);
      } else {
        setFileError(response.data.message);
      }

      setSending(false);
    } catch (err) {
      // console.log(err);
      setSending(false);
      setFileError(err.message);
    }
  };

  const handleFileChange = async (file) => {
    setTempFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // while scrolling up it sould load more messages from 100px from top
    if (scrollTop < 100 && scrollHeight > clientHeight) {
      handleLoadMore();
    }
  };

  if (sub_loading || sub_loading_message_receipients) return <Loading />;
  if (sub_data?.classrooms_by_pk === null) return <NotFoundPage />;

  const currentUser = sub_data?.classrooms_by_pk?.classroom_relation.find((cr) => cr.user.id === user.sub);

  return (
    <section>
      <HeaderSlot>
        <Button
          size="small"
          onClick={() => router.back()}
          radius="large"
          variant="ghost"
          className="hidden md:flex items-center bg-content2 text:content1"
        >
          <Icon icon="line-md:chevron-left" />
          <span className="ml-0.5">Back</span>
        </Button>
        <button
          onClick={() => router.back()}
          className="grid md:hidden justify-center items-center h-[44px] w-[44px] rounded-full px-0 bg-blue-500 text-white shadow-[0px_0px_5px_1px_#3b82f6c7]"
        >
          <Icon icon="line-md:chevron-left" />
        </button>
      </HeaderSlot>

      <div className="flex border-2 border-content2 rounded-lg h-[calc(100vh_-_150px)] md:h-[calc(100vh_-_108px)] overflow-hidden">
        <div className="hidden xl:block pt-5 flex-initial max-w-[calc(100%_-_20px)] w-[300px] border-r-2 border-content2 overflow-hidden h-[calc(100vh_-_108px)] overflow-y-auto">
          <div>
            <h3 className="text-xl font-semibold px-5">Messages</h3>
            <p className="text-xs px-5">Send messages to other members of the classroom</p>
            <div className="mt-5 ">
              {receipients.map((r) => {
                if (r.type === "all") {
                  if (sub_data?.classrooms_by_pk?.child_only) {
                    return null;
                  }
                  return (
                    <Link
                      href={`/classroom/${cid}/message/${r.id}`}
                      key={r.id}
                      className={cn("flex items-center space-x-2 my-1 py-2 px-4", {
                        "bg-content2": r.id === mid,
                      })}
                    >
                      <div className="flex-initial h-10 w-10 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                        <Icon icon="mingcute:group-3-fill" className="w-7 h-7 text-content2-foreground" />
                      </div>
                      <div className="flex-auto">
                        <h4 className="font-medium text-sm">{r.name}</h4>
                        <p className="text-xs">All members of the classroom</p>
                      </div>
                    </Link>
                  );
                }
                return (
                  <Link
                    href={`/classroom/${cid}/message/${r.id}`}
                    key={r.id}
                    className={cn("flex items-center space-x-2 my-1 py-2 px-4", {
                      "bg-content2": r.id === mid,
                    })}
                  >
                    <div className="flex-initial">
                      <img src={r.image} alt={r.name} className="w-10 h-10 rounded-full" />
                    </div>
                    <div className="flex-auto">
                      <h4 className="font-medium text-sm">{r.name}</h4>
                      <p className="text-xs">{r.role}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex-auto w-[min-content]">
          <div className="flex flex-col justify-between h-full">
            {error && (
              <div className="flex-initial pb-5">
                <Alert
                  className="mb-4"
                  title="Something went wrong"
                  description={error}
                  onClose={() => setError(null)}
                  color="danger"
                />
              </div>
            )}

            {/* content body start */}
            <div className="flex-auto overflow-hidden">
              <div
                className="flex h-full flex-col-reverse gap-2 items-end overflow-y-auto overflow-x-hidden p-5"
                ref={scrollRef}
                onScroll={onScroll}
              >
                {loadingMore && (
                  <div className="flex justify-center items-center py-5">
                    <Icon icon="eos-icons:three-dots-loading" className="w-10 h-10 text-gray-500 dark:text-gray-200" />
                  </div>
                )}
                {messages.length > 0 ? (
                  messages.map((message, index) => {
                    // if message is not in the message ids then return null
                    if (!messageIds.includes(message.id)) return null;
                    // convert created at to date
                    // const date = moment(message.created_at).format("DD MMM, YYYY");
                    // const hadDate = dates.includes(date);

                    // if (!dates.includes(date)) {
                    //   setDates((prev) => prev.concat(date));
                    // }
                    if (message?.content?.type === "system") {
                      return (
                        <React.Fragment key={index}>
                          <div className="flex flex-col justify-center items-center my-2 w-full">
                            {/* {!hadDate && (
                              <div className="flex justify-center items-center my-2 w-full">
                                <span className="text-[10px]  bg-gray-400 dark:bg-neutral-700 px-2 py-0.5 rounded-lg text-white font-medium">
                                  {date}
                                </span>
                              </div>
                            )} */}
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {message?.content?.text} at {moment(message.created_at).format("DD MMM, YYYY hh:mm A")}
                            </span>
                          </div>
                        </React.Fragment>
                      );
                    }

                    if (message?.content?.type === "text") {
                      return (
                        <React.Fragment key={index}>
                          <div className="flex flex-col w-full">
                            {/* {!hadDate && (
                              <div className="flex justify-center items-center my-2 w-full">
                                <span className="text-[10px]  bg-gray-400 dark:bg-neutral-700 px-2 py-0.5 rounded-lg text-white font-medium">
                                  {date}
                                </span>
                              </div>
                            )} */}
                            <div
                              className={cn("flex items-end gap-2 w-full", {
                                "justify-start flex-row-reverse": message.user.id === user.sub,
                                "justify-start flex-row": message.user.id !== user.sub,
                              })}
                            >
                              <Avatar
                                radius="full"
                                className="w-5 h-5 text-tiny"
                                src={message.user.avatar}
                                name={message.user.name}
                              />

                              <div
                                className={cn(
                                  "flex flex-col w-fit max-w-[80%] rounded-lg p-2 pb-0.5 text-sm group relative",
                                  {
                                    "bg-blue-500 text-white": message.user.id === user.sub,
                                    "bg-gray-200 dark:bg-neutral-700": message.user.id !== user.sub,
                                  }
                                )}
                              >
                                {receipients.find((r) => r.id === mid)?.type === "all" &&
                                  message.user.id !== user.sub && (
                                    <h3
                                      className={cn("text-xs font-semibold", {
                                        "text-white": message.user.id === user.sub,
                                        "text-gray-900 dark:text-white": message.user.id !== user.sub,
                                      })}
                                    >
                                      {message.user.id === user.sub ? "You" : message.user.name}
                                    </h3>
                                  )}
                                <p>{message.content.text}</p>
                                <p
                                  className={cn("text-[10px] whitespace-nowrap ", {
                                    "text-white text-right": message.user.id === user.sub,
                                    "text-gray-500 dark:text-gray-400 text-left": message.user.id !== user.sub,
                                  })}
                                >
                                  {moment(message.created_at).format("DD MMM, YYYY hh:mm A")}
                                </p>
                                {/* if sender is currnet user */}
                                {message.user.id === user.sub && (
                                  <div className="hidden group-hover:grid h-full items-center absolute -left-12 pr-4 top-0 bottom-0">
                                    <Button
                                      isIconOnly
                                      variant="text"
                                      aria-label="Delete message"
                                      onClick={() => setDeleteId(message.id)}
                                      className="p-0.5 rounded-full hover:bg-red-200 cursor-pointer mr-2"
                                    >
                                      <Icon
                                        icon="solar:trash-bin-trash-bold-duotone"
                                        className="w-4 h-4 text-danger-500 "
                                      />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    }

                    if (message?.content?.type === "file") {
                      return (
                        <React.Fragment key={index}>
                          <div className="flex flex-col w-full">
                            {/* {!hadDate && (
                              <div className="flex justify-center items-center my-2 w-full">
                                <span className="text-[10px]  bg-gray-400 dark:bg-neutral-700 px-2 py-0.5 rounded-lg text-white font-medium">
                                  {date}
                                </span>
                              </div>
                            )} */}
                            <div
                              className={cn("flex items-end gap-2 w-full", {
                                "justify-start flex-row-reverse": message.user.id === user.sub,
                                "justify-start flex-row": message.user.id !== user.sub,
                              })}
                            >
                              <Avatar
                                radius="full"
                                className="w-5 h-5 text-tiny"
                                src={message.user.avatar}
                                name={message.user.name}
                              />

                              <div
                                className={cn(
                                  "flex flex-col w-fit max-w-[80%] rounded-lg p-2 pb-0.5 text-sm group relative",
                                  {
                                    "bg-blue-500 text-white": message.user.id === user.sub,
                                    "bg-gray-200 dark:bg-neutral-700": message.user.id !== user.sub,
                                  }
                                )}
                              >
                                {receipients.find((r) => r.id === mid)?.type === "all" &&
                                  message.user.id !== user.sub && (
                                    <h3
                                      className={cn("text-xs font-semibold", {
                                        "text-white": message.user.id === user.sub,
                                        "text-gray-900 dark:text-white": message.user.id !== user.sub,
                                      })}
                                    >
                                      {message.user.id === user.sub ? "You" : message.user.name}
                                    </h3>
                                  )}
                                <div className="">
                                  {message.content.files[0].type === "image" ? (
                                    <div className="relative">
                                      <img
                                        src={`${process.env.CLASSROOM_CDN_URL}/${message.content.files[0].location}`}
                                        alt={message.content.files[0].name}
                                        className="w-48 h-48 rounded-lg object-cover"
                                      />
                                      <Link
                                        href={`${process.env.CLASSROOM_CDN_URL}/${message.content.files[0].location}`}
                                        target="_blank"
                                      >
                                        <div className="absolute top-0 left-0 w-full h-full bg-black/50 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                                          View Image
                                        </div>
                                      </Link>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={cn(
                                          "flex-initial h-10 w-10 rounded-xl flex items-center justify-center border-2 border-dotted",
                                          {
                                            "bg-blue-500 text-white border-white": message.user.id === user.sub,
                                            "bg-gray-200 dark:bg-neutral-700 border-gray-500":
                                              message.user.id !== user.sub,
                                          }
                                        )}
                                      >
                                        <Icon
                                          icon="akar-icons:file"
                                          className={cn("w-5 h-5", {
                                            "text-white": message.user.id === user.sub,
                                            "text-gray-500 dark:text-gray-200": message.user.id !== user.sub,
                                          })}
                                        />
                                      </div>
                                      <div>
                                        <p className="text-[143x]">{message.content.files[0].name}</p>
                                        <p className="text-[10px]">{message.content.files[0].size}</p>
                                      </div>
                                      <Link
                                        href={`${process.env.CLASSROOM_CDN_URL}/${message.content.files[0].location}`}
                                        target="_blank"
                                      >
                                        <div
                                          className={cn("px-2  rounded-lg flex items-center justify-center", {
                                            "bg-blue-500 text-white": message.user.id === user.sub,
                                            "bg-gray-200 dark:bg-neutral-700": message.user.id !== user.sub,
                                          })}
                                        >
                                          <Icon icon="akar-icons:download" className="w-4 h-4" />
                                        </div>
                                      </Link>
                                    </div>
                                  )}
                                </div>
                                <p
                                  className={cn("text-[10px] whitespace-nowrap ", {
                                    "text-white text-right": message.user.id === user.sub,
                                    "text-gray-500 dark:text-gray-400 text-left": message.user.id !== user.sub,
                                  })}
                                >
                                  {moment(message.created_at).format("DD MMM, YYYY hh:mm A")}
                                </p>

                                {/* if sender is currnet user */}
                                {message.user.id === user.sub && (
                                  <div className="hidden group-hover:grid h-full items-center absolute -left-12 pr-4 top-0 bottom-0">
                                    <Button
                                      isIconOnly
                                      variant="text"
                                      aria-label="Delete message"
                                      onClick={() => setDeleteId(message.id)}
                                      className="p-0.5 rounded-full hover:bg-red-200 cursor-pointer mr-2"
                                    >
                                      <Icon
                                        icon="solar:trash-bin-trash-bold-duotone"
                                        className="w-4 h-4 text-danger-500 "
                                      />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    }
                  })
                ) : (
                  <p className="text-center">No messages yet</p>
                )}
              </div>
            </div>
            {/* content body end */}

            <div className="flex-initial flex items-end gap-4 p-5">
              <div className="flex-initial">
                <Button
                  isIconOnly
                  aria-label="Take a photo"
                  variant="faded"
                  onClick={() => {
                    setFilePicker("image");
                    setTempFile(null);
                    setTempFilePreview(null);
                    setFileError(null);
                    setFilePicker(true);
                  }}
                  isDisabled={sending}
                >
                  <Icon icon="tabler:photo-plus" className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-auto">
                <Textarea
                  placeholder="Type your message here..."
                  minRows={1}
                  maxRows={5}
                  className="w-full rounded-lg"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  isReadOnly={sending}
                />
              </div>
              <div className="flex-initial">
                <Button
                  isIconOnly
                  aria-label="Take a photo"
                  variant="faded"
                  isLoading={sending}
                  onClick={handleSendMessage}
                >
                  <Icon icon="mynaui:send-solid" className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {filePicker && (
        <div className="bg-black/5 fixed inset-0 z-50 flex items-center justify-center top-0 left-0 right-0 bottom-0 backdrop-blur-[5px]">
          <div className="bg-white dark:bg-black p-5 rounded-xl max-w-[90%] w-[512px]">
            {tempFile ? (
              <div className="">
                <div className="flex justify-center content-center">
                  <Icon icon="akar-icons:file" className="h-full w-36 text-default-400 py-5" />
                </div>
                <p className="text-center text-xs text-gray-500">
                  {tempFile.name} - {tempFile.size / 1000000}MB
                </p>
              </div>
            ) : (
              <FileUploader
                handleChange={handleFileChange}
                // free users 10mb pro users 50mb
                maxSize={user?.user?.is_plus ? 50 : 10}
                overRide
              >
                <div className="border-2 border-dotted border-default-200 rounded-lg flex items-center justify-center px-4 py-8 mb-2">
                  <Icon icon="akar-icons:upload" className="h-8 w-8 text-default-400" />
                  <p className="text-sm text-default-400">Drag and drop your file here or click to upload</p>
                </div>
                <p className="text-xs text-default-400">
                  <span className="text-danger-500">*</span>
                  {/* Max file size: {user?.user?.is_plus ? 50 : 10}MB */}
                  Max file size: 10MB
                </p>
                {/* {!user?.user?.is_plus && (
                  <p className="text-xs text-default-400">
                    <span className="text-danger-500">*</span>
                    Upgrade to plus to upload bigger files.
                  </p>
                )} */}
              </FileUploader>
            )}

            {fileError && <Alert className="my-2" color="danger" title="Error" description={fileError} />}

            <div className="flex justify-end w-full">
              <Button
                className="mt-4 bg-danger text-background rounded-sm mr-2"
                size="sm"
                variant="text"
                onPress={() => {
                  setTempFile(null);
                  setFilePicker(false);
                }}
                isDisabled={sending}
              >
                Cancel
              </Button>
              <Button
                className="mt-4 bg-default-foreground text-background rounded-sm"
                size="sm"
                variant="text"
                onPress={handleFileUpload}
                isDisabled={!tempFile}
                isLoading={sending}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== "" && (
        <DeleteMessageAction
          handleClose={() => setDeleteId("")}
          handleSubmit={() => handleDeleteMessage(deleteId)}
          error={error}
          loading={deleting}
        />
      )}
    </section>
  );
}
