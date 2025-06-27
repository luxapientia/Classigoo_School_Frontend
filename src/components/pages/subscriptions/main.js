"use client";

import React from "react";
import axios from "@lib/axios";
import ProfileCard from "./profile-card";
import { useSearchParams } from "next/navigation";

// import { useQuery } from "@apollo/client";
// import { GET_SUBSCRIPTIONS } from "@graphql/queries";
import { Alert, Avatar, Button } from "@heroui/react";
import Loading from "@components/common/loading";

export default function SubscriptionMainComponent({ userInfo }) {
  const params = useSearchParams();
  const [self, setSelf] = React.useState({});
  const [error, setError] = React.useState("");
  const [subscription, setSubscription] = React.useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = React.useState(false);
  const [success, setSuccess] = React.useState("");
  const [children, setChildren] = React.useState([]);
  const [isChild, setIsChild] = React.useState(false);
  const [isParent, setIsParent] = React.useState(false);

  // const {
  //   loading: q_loading,
  //   error: q_error,
  //   data: q_data,
  // } = useQuery(GET_SUBSCRIPTIONS, {
  //   variables: { id: user.sub },
  // });

  // Get subscriptions
  const fetchSubscriptions = React.useCallback(async () => {
    setSubscriptionLoading(true);
    try {
      const { data } = await axios.get(`/v1/subscription/${userInfo._id}`);
      setSubscription(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load subscriptions");
    } finally {
      setSubscriptionLoading(false);
    }
  }, [userInfo._id]);

  React.useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  React.useEffect(() => {
    if (params.get("status") === "success") {
      setSuccess("Successfully subscribed to the Classigoo plus plan.");
    } else if (params.get("status") === "cancel") {
      setError("The subscription process cancelled.");
    }
  }, []);

  React.useEffect(() => {
    if (subscription) {
      if (subscription.parents_count > 0) {
        setIsChild(true);
      } else if (subscription.children_count > 0) {
        setIsParent(true);
      }

      setSelf({
        self: true,
        manageable: !isChild,
        ...subscription.user,
      });

      let obj = [];
      subscription.children.forEach((item) => {
        obj.push({
          self: false,
          manageable: isParent,
          ...item.child,
        });
      });

      setChildren(obj);
    }
  }, [subscription]);

  return (
    <section>
      {subscriptionLoading ? (
        <div className="">
          <Loading />
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-4xl font-bold">Subscriptions</h1>
          </div>
          <div className="mt-8">
            <div className="flex max-w-2xl flex-col gap-3">
              {error && (
                <Alert
                  hideIcon
                  color="danger"
                  variant="faded"
                  className="text-xs"
                >
                  {error}
                </Alert>
              )}
              {success && (
                <Alert
                  hideIcon
                  color="success"
                  variant="faded"
                  className="text-xs"
                >
                  {success}
                </Alert>
              )}
              <ProfileCard user={self} manageable={!isChild} />
              {children.map((child, index) => (
                <ProfileCard user={child} manageable={isParent} key={index} />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
