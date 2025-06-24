"use client";
import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useRouter } from "nextjs-toploader/app";
import { Button, Textarea } from "@heroui/react";

// graphql imports
// import { GET_PROFILE } from "@graphql/queries";
// import { useQuery, useMutation } from "@apollo/client";
// import { CHAT_WITH_AI_BUDDY } from "@graphql/mutations";
import PhysicsLayoutComponent from "./layout";

export default function PhysicsMainComponent({ userInfo }) {
  // hooks
  const router = useRouter();

  // states
  const [error, setError] = React.useState("");
  const [prompt, setPrompt] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // mutation
  // const [chatWithAIBuddy] = useMutation(CHAT_WITH_AI_BUDDY);

  // get user data
  // const {
  //   data: user_data,
  //   loading: user_loading,
  //   error: user_error,
  // } = useQuery(GET_PROFILE, {
  //   variables: { id: user.sub },
  // });

  const initiateChat = async () => {
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

    try {
      // const { data } = await chatWithAIBuddy({
      //   variables: {
      //     model: "physics",
      //     prompt: prompt,
      //   },
      // });

      const { data } = await axios.post("/v1/aibuddy/chat", {
        model: "physics",
        prompt: prompt,
      });

      if (data.status === "success") {
        router.push(`/buddy/physics/${data.chat_id}`);
      } else {
        setError(data.message);
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (error !== "") {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <PhysicsLayoutComponent
      user_data={userInfo}
      setError={setError}
      isLoading={false}
    >
      {userInfo?.is_plus ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-center text-neutral-800 dark:text-neutral-100 font-bold text-lg">
            Welcome to Physics Buddy!
          </h1>
          <p className="text-center text-neutral-800 dark:text-neutral-100 font-medium text-xs">
            Ask me anything about physics and I will do my best to help you.
          </p>
          <div className="relative mt-4 w-full sm:w-[calc(100%_-_100px)] md:w-[calc(100%_-_250px)] xl:w-1/2">
            <Textarea
              variant="solid"
              placeholder="Ask me anything about physics..."
              rounded="md"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              classNames={{
                inputWrapper:
                  "bg-gray-200 dark:bg-neutral-800 focus:bg-gray-200 dark:bg-neutral-800",
              }}
              rows={4}
            />

            <Button
              variant="text"
              className="text-black dark:text-white bg-white dark:bg-neutral-900 sm:w-auto absolute right-1 bottom-1 rounded-full"
              onClick={initiateChat}
              rounded="full"
              size="sm"
              isIconOnly
              isLoading={loading}
            >
              <Icon icon="solar:arrow-up-line-duotone" className="text-lg" />
            </Button>
          </div>
          {error !== "" && (
            <div className="relative mt-4 w-full sm:w-1/2">
              <div className="py-2 px-4 w-full border border-danger bg-danger/5 rounded-lg">
                <p className="text-danger text-xs font-medium">{error}</p>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center justify-center mt-4">
            <p className="text-center text-neutral-800 dark:text-neutral-100 font-medium text-[10px]">
              Your AI Buddy is ready to help you with your physics questions!
            </p>
            <p className="text-center text-neutral-800 dark:text-neutral-100 font-medium text-[10px]">
              You can also check your history by clicking on the sidebar icon.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-center text-neutral-800 dark:text-neutral-100 font-bold text-lg">
            Oops! You found a premium feature!
          </h1>
          <p className="text-center text-neutral-800 dark:text-neutral-100 font-medium text-xs">
            You need to subscribe to classigoo plus to use this feature.
          </p>
          <Link href="/subscriptions">
            <Button
              variant="text"
              className="mt-4 px-4 py-2 text-white bg-black w-full sm:w-auto"
              // onClick={() => router.push("/subscriptions")}
            >
              Subscribe Now
            </Button>
          </Link>
        </div>
      )}
    </PhysicsLayoutComponent>
  );
}
