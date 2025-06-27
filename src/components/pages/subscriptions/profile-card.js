"use client";
import React from "react";
import axios from "@lib/axios";
import { Avatar, Button } from "@heroui/react";

// import { useMutation } from "@apollo/client";
// import { CREATE_SUBSCRIPTION, MANAGE_SUBSCRIPTION } from "@graphql/mutations";
import ActionCard from "./action";

export default function ProfileCard({ user, manageable }) {
  const [plan, setPlan] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  // const [createSubscription] = useMutation(CREATE_SUBSCRIPTION);
  // const [manageSubscription] = useMutation(MANAGE_SUBSCRIPTION);

  const handleClose = React.useCallback(() => {
    setShowModal(false);
    setPlan("");
  }, [plan, showModal]);

  const handleCreateSubscription = React.useCallback(
    async (e) => {
      try {
        // e.preventDefault();
        setLoading(true);
        if (!user.is_plus) {
          // const { data } = await createSubscription({
          //   variables: { id: user.id, plan },
          // });

          const { data: res } = await axios.post("/v1/subscription/create", {
            id: user.id,
            plan,
          });

          if (res.status === "success") {
            window.location.href = res.url;
          }
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    },
    [plan, loading, user]
  );

  const handleManageSubscription = React.useCallback(async () => {
    console.log("manage subscription");
    try {
      setLoading(true);
      console.log(user);
      if (user.is_plus) {
        // const { data } = await manageSubscription({
        //   variables: { id: user.id },
        // });

        const { data: res } = await axios.post("/v1/subscription/manage", {
          id: user.id,
        });

        if (res.status === "success") {
          window.location.href = res.url;
        }
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.log(error);
    }
  }, [loading, user]);

  return (
    <>
      {showModal && (
        <ActionCard
          setPlan={setPlan}
          plan={plan}
          handleClose={handleClose}
          handleSubmit={handleCreateSubscription}
          error={error}
          loading={loading}
        />
      )}
      <div className="sm:flex p-5 border-2 border-default-200 gap-4 relative bg-content1 text-gray-700 dark:text-white mt-2">
        <div className="absolute top-0 right-0 px-2 py-0.5 sm:px-5 sm:py-2  md:px-4 md:py-1 lg:px-5 lg:py-2 text-xs bg-default-200">
          <p>{user.self ? "Your Subscription" : "Child's Subscription"}</p>
        </div>
        <div className="flex-initial grid justify-center sm:block pt-3 pb-5 sm:py-0">
          <Avatar src={user.avatar} className={"h-36 w-36"} radius="none" />
        </div>
        <div className="flex-auto">
          <h3 className="text-2xl font-bold sm:text-left text-center">
            {user.name}
          </h3>
          <p className="sm:text-left text-center">{user.email}</p>
          <p className="flex justify-center sm:justify-normal sm:items-center pt-1 sm:text-left text-center">
            Current Plan: {"  "}
            <span
              className={`ml-2 px-2 py-1 text-background text-xs font-semibold rounded-md ${
                user.is_plus ? "bg-[#fdcb6e] text-gray-700" : "bg-[#e74c3c]"
              }`}
            >
              {user.is_plus ? "Plus" : "Free"}
            </span>
          </p>
          {!manageable && (
            <p className="flex items-center pt-1 italic text-xs">
              You are a child. Your parent can manage your subscription.
            </p>
          )}
          <div className="flex justify-end">
            {user.is_plus ? (
              <Button
                variant="text"
                radius="none"
                isLoading={loading}
                onClick={handleManageSubscription}
                className={`mt-4 px-4 py-2 text-white bg-primary w-full sm:w-auto`}
                isDisabled={!manageable}
              >
                Manage Subscription
              </Button>
            ) : (
              <Button
                variant="text"
                radius="none"
                isLoading={loading}
                onClick={() => setShowModal(true)}
                className={`mt-4 px-4 py-2 text-white bg-black w-full sm:w-auto`}
                isDisabled={!manageable}
              >
                Subscribe Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
