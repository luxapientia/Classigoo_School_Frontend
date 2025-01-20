"use client";

import React from "react";
import ProfileCard from "./profile-card";
import { useSearchParams } from "next/navigation";

import { useQuery } from "@apollo/client";
import { GET_SUBSCRIPTIONS } from "@graphql/queries";
import { Alert, Avatar, Button } from "@heroui/react";
import Loading from "@components/common/loading";

export default function SubscriptionMainComponent({ user }) {
  const params = useSearchParams();
  const [self, setSelf] = React.useState({});
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [children, setChildren] = React.useState([]);
  const [isChild, setIsChild] = React.useState(false);
  const [isParent, setIsParent] = React.useState(false);

  const {
    loading: q_loading,
    error: q_error,
    data: q_data,
  } = useQuery(GET_SUBSCRIPTIONS, {
    variables: { id: user.sub },
  });

  React.useEffect(() => {
    if (params.get("status") === "success") {
      setSuccess("Successfully subscribed to the Classigoo plus plan.");
    } else if (params.get("status") === "cancel") {
      setError("The subscription process cancelled.");
    }
  }, []);

  React.useEffect(() => {
    if (q_data) {
      if (q_data.parent_count.aggregate.count > 0) {
        setIsChild(true);
      } else if (q_data.child_count.aggregate.count > 0) {
        setIsParent(true);
      }

      setSelf({
        self: true,
        manageable: !isChild,
        ...q_data.users_by_pk,
      });

      let obj = [];
      q_data.child_parent.forEach((item) => {
        obj.push({
          self: false,
          manageable: isParent,
          ...item.child,
        });
      });

      setChildren(obj);
    }
  }, [q_data]);

  return (
    <section>
      {q_loading ? (
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
