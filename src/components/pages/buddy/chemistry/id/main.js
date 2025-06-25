"use client";
import cn from "classnames";
import axios from "@lib/axios"
import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import ChemistryLayoutComponent from "../layout";
import { useRouter } from "nextjs-toploader/app";
import { Button, Textarea } from "@heroui/react";
import MarkdownRender from "@components/common/markdown";

// graphql imports
// import { GET_PROFILE } from "@graphql/queries";
// import { useQuery, useMutation } from "@apollo/client";
// import {
//   CHAT_WITH_AI_BUDDY,
//   RETRIEVE_SINGLE_AI_BUDDY_CHAT,
// } from "@graphql/mutations";
import NotFoundComponent from "@components/common/404";

export default function ChemistrySingleMainComponent({ userInfo, id }) {
  // hooks
  const router = useRouter();

  // refs
  const chatRef = React.useRef(null);

  // states
  const [error, setError] = React.useState("");
  const [prompt, setPrompt] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [notFound, setNotFound] = React.useState(false);
  const [chatHistory, setChatHistory] = React.useState([]);
  const [pageLoading, setPageLoading] = React.useState(false);

  // mutation
  // const [retrieveSingleAIBuddyChat] = useMutation(
  //   RETRIEVE_SINGLE_AI_BUDDY_CHAT
  // );
  // const [chatWithAIBuddy] = useMutation(CHAT_WITH_AI_BUDDY);

  // get user data
  // const {
  //   data: user_data,
  //   loading: user_loading,
  //   error: user_error,
  // } = useQuery(GET_PROFILE, {
  //   variables: { id: user.sub },
  // });

  // get chat history
  React.useEffect(() => {
    if (chatHistory.length === 0) {
      const fetchChatHistory = async () => {
        setPageLoading(true);
        try {
          // const { data } = await retrieveSingleAIBuddyChat({
          //   variables: {
          //     id: id,
          //     model: "chemistry",
          //   },
          // });

          const { data } = await axios.post("/v1/aibuddy/retrieve", {
            chat_id: id,
            model: "chemistry",
          });

          if (data.status === "success") {
            setChatHistory(data?.chats);
          } else {
            setError(data?.message);
            if (data?.not_found) {
              setNotFound(true);
            }
          }
        } catch (error) {
          setError("Something went wrong. Please try again.");
        } finally {
          setPageLoading(false);
        }
      };
      fetchChatHistory();
    }
  }, [id]);

  React.useEffect(() => {
    if (error !== "") {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const sendMessage = async () => {
    setLoading(true);
    if (!prompt) {
      setError("Please type a question.");
      setLoading(false);
      return;
    }

    if (prompt.length < 10) {
      setError("Question must be at least 10 characters.");
      setLoading(false);
      return;
    }

    if (prompt.length > 1024) {
      setError("Question must be less than 1024 characters.");
      setLoading(false);
      return;
    }

    // add user prompt to chat history
    setChatHistory((prev) => [
      ...prev,
      {
        role: "user",
        content: prompt,
      },
    ]);

    const promptBefore = prompt;

    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
    setPrompt("");

    try {
      // const { data } = await chatWithAIBuddy({
      //   variables: {
      //     model: "chemistry",
      //     prompt: promptBefore,
      //     chat_id: id,
      //   },
      // });

      const { data } = await axios.post("/v1/aibuddy/chat", {
        model: "chemistry",
        prompt: promptBefore,
        chat_id: id,
      });

      if (data.status === "success") {
        // add new chat to chat history
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data?.content,
          },
        ]);
        setPrompt("");
        // scroll to bottom
        setTimeout(() => {
          if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }, 100);
        // set success message
        setSuccess(data?.message);
      } else {
        setError(data?.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChemistryLayoutComponent
      user_data={userInfo}
      setError={setError}
      isLoading={pageLoading}
      active={id}
    >
      {notFound ? (
        <div className="h-full flex flex-col items-center justify-center">
          <h1 className="text-center text-neutral-800 dark:text-neutral-100 font-bold text-lg">
            Oops! Chat not found.
          </h1>
          <p className="text-center text-neutral-800 dark:text-neutral-100 font-medium text-xs">
            The chat you are looking for does not exist or has been deleted.
          </p>
          <Link href="/buddy/chemistry">
            <Button
              variant="text"
              className="mt-4 px-4 py-2 text-white bg-black w-full sm:w-auto"
              onClick={() => router.push("/buddy/chemistry")}
            >
              Start a new chat
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col overflow-hidden items-center h-full">
          <div className="flex-auto basis-0 overflow-hidden w-full max-w-[calc(100vw_-_10px)]">
            <div
              ref={chatRef}
              className="h-full overflow-y-auto overflow-x-auto"
            >
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    chat.role === "user" ? "items-end" : "items-center"
                  }`}
                >
                  <div className={`p-2 m-2 max-w-[80%]`}>
                    {chat.role === "user" ? (
                      <div className="bg-gray-200 dark:bg-neutral-900 px-4 py-2 rounded-2xl text-black dark:text-white">
                        {chat.content}
                      </div>
                    ) : (
                      <article
                        className={cn(
                          "prose max-w-4xl prose-base",
                          chat.role === "user"
                            ? "prose-invert"
                            : "prose-neutral",
                          "dark:prose-invert"
                        )}
                      >
                        <MarkdownRender>{chat.content}</MarkdownRender>
                      </article>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className={`flex flex-colitems-center`}>
                  <div className={`p-2 m-2 max-w-[80%]`}>
                    <div className="text-black dark:text-white">
                      Thinking...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-initial w-full pt-4">
            <div className="w-full relative">
              {error && (
                <div className=" w-full bg-red-500/10 border-danger-400 border text-xs mb-2 text-black dark:text-white p-2 rounded-md">
                  {error}
                </div>
              )}

              {userInfo?.is_plus ? (
                <React.Fragment>
                  <Textarea
                    variant="solid"
                    placeholder="Ask me anything about chemistry..."
                    rounded="md"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    classNames={{
                      inputWrapper:
                        "bg-gray-200 dark:bg-neutral-800 focus:bg-gray-200 dark:bg-neutral-800",
                    }}
                    rows={4}
                    maxRows={6}
                  />
                  <Button
                    variant="text"
                    className="text-black dark:text-white bg-white dark:bg-neutral-900 sm:w-auto absolute right-1 bottom-1 rounded-full"
                    rounded="full"
                    size="sm"
                    isIconOnly
                    isLoading={loading}
                    onClick={sendMessage}
                  >
                    <Icon
                      icon="mynaui:send-solid"
                      className="text-black dark:text-white"
                      width="20"
                      height="20"
                    />
                  </Button>
                </React.Fragment>
              ) : (
                <div className="w-full bg-yellow-500/10 border-yellow-400 border text-xs mb-2 text-black dark:text-white p-2 rounded-md justify-center flex flex-col items-center">
                  <p>
                    You are using a free account. Please upgrade to Plus to
                    unlock this feature.
                  </p>
                  <Link href="/subscriptions">
                    <Button
                      variant="text"
                      className="mt-2 px-4 py-2 text-white bg-black w-full sm:w-auto
                      rounded-full"
                      // onClick={() => router.push("/settings/billing")}
                    >
                      Upgrade to Plus
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ChemistryLayoutComponent>
  );
}
