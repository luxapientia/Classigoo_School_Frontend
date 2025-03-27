"use client";
import React from "react";
import moment from "moment";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Alert, Tooltip, User } from "@heroui/react";
import ClassroomLayout from "../layout/layout";
import { useRouter } from "nextjs-toploader/app";
import { HeaderSlot } from "@components/layout/header";

import { START_CHAT } from "@graphql/mutations";
import { useSubscription, useMutation } from "@apollo/client";
import { SUB_GET_CLASSROOM, SUB_LIST_MESSAGE_RECEIPIENTS } from "@graphql/subscriptions";
import Loading from "@components/common/loading";

export default function ClassroomMessagesMain({ id, session }) {
  const router = useRouter();

  const [error, setError] = React.useState(null);
  const [receipients, setReceipients] = React.useState([]);
  const [newRecipients, setNewRecipients] = React.useState([]);
  const [loadingNewConversation, setLoadingNewConversation] = React.useState(false);

  const [startChat] = useMutation(START_CHAT);

  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_GET_CLASSROOM, {
    variables: { id },
  });

  const {
    data: sub_data_message_receipients,
    loading: sub_loading_message_receipients,
    error: sub_error_message_receipients,
  } = useSubscription(SUB_LIST_MESSAGE_RECEIPIENTS, {
    variables: { cid: id },
  });

  // Check if the current user is a member of the classroom
  const currentUser = sub_data?.classrooms_by_pk?.classroom_relation.find((cr) => cr.user.id === session.user.sub);

  React.useEffect(() => {
    if (sub_data?.classrooms_by_pk && sub_data_message_receipients) {
      let r = [];
      let u = [];

      console.log(sub_data_message_receipients);

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
            name: mr?.users?.find((u) => u?.user?.id !== session?.user?.sub)?.user?.name,
            image: mr?.users?.find((u) => u?.user?.id !== session?.user?.sub)?.user?.avatar,
            uid: mr?.users?.find((u) => u?.user?.id !== session?.user?.sub)?.user?.id,
            role:
              mr?.users?.find((u) => u?.user?.id !== session?.user?.sub)?.user?.role === "student"
                ? "Student"
                : "Teacher",
          });
        }
      });

      // get the users who are not in the receipients list
      sub_data.classrooms_by_pk.classroom_relation.forEach((cr) => {
        if (cr.user.id !== session.user.sub) {
          if (!r.find((rr) => rr.uid === cr.user.id)) {
            u.push({
              id: cr.user.id,
              name: cr.user.name,
              image: cr.user.avatar,
              role: cr.user.role === "student" ? "Student" : "Teacher",
            });
          }
        }
      });

      setReceipients(r);
      setNewRecipients(u);
    }
  }, [sub_data_message_receipients, sub_data]);

  const handleStartChat = async (uid) => {
    setLoadingNewConversation(true);
    try {
      const res = await startChat({
        variables: {
          uid,
          cid: id,
        },
      });

      if (res.data.initiateChat.status === "success") {
        // redirect to the chat page
        router.push(`/classroom/${id}/message/${res.data.initiateChat.id}`);
      } else {
        setError(res.data.initiateChat.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingNewConversation(false);
    }
  };

  return (
    <>
      <ClassroomLayout
        id={id}
        loading={sub_loading || sub_loading_message_receipients}
        classroom={sub_data?.classrooms_by_pk}
      >
        {/* {(currentUser?.role === "owner" || currentUser?.role === "teacher") && (
          <HeaderSlot>
            <Link
              href={`/classroom/${id}/assignment/create`}
              className="hidden md:flex items-center bg-content2 text:content1 px-4 py-2 border-2 rounded-xl"
            >
              <Icon icon="akar-icons:plus" />
              <span className="ml-1">Create Assignment</span>
            </Link>
            <Link
              href={`/classroom/${id}/assignment/create`}
              className="grid md:hidden justify-center items-center h-[44px] w-[44px] rounded-full px-0 bg-blue-500 text-white shadow-[0px_0px_5px_1px_#3b82f6c7]"
            >
              <Icon icon="akar-icons:plus" />
            </Link>
          </HeaderSlot>
        )} */}

        {loadingNewConversation && (
          <div className="fixed top-0 right-0 left-0 bottom-0 z-50 p-5 bg-white/15 dark:bg-black/15 backdrop-blur-2xl flex items-center justify-center">
            <Loading />
          </div>
        )}

        {error && (
          <Alert
            title="Something went wrong"
            color="danger"
            description={error}
            onClose={() => setError(null)}
            className="mb-5"
          />
        )}

        {receipients.length !== 0 && (
          <section className="p-5 rounded-2xl border-2 border-dotted border-content2">
            <h2 className="text-lg font-semibold mb-2">Recent Messages</h2>
            <div className="grid grid-cols-5 gap-4">
              {receipients.map((r) => {
                if (r.type === "all") {
                  return (
                    <Link key={r.id} href={`/classroom/${id}/message/${r.id}`}>
                      <div className="p-5 bg-content2 rounded-2xl cursor-pointer flex">
                        <div className="flex-initial h-10 w-10 bg-gray-200 dark:bg-neutral-700 rounded-full grid place-items-center">
                          <Icon icon="mingcute:group-3-fill" className="h-6 w-6" />
                        </div>
                        <div className="flex-auto pl-2">
                          <h3 className="text-base font-semibold">General Chat</h3>
                          <p className="text-xs text-content3-foreground">Group</p>
                        </div>
                      </div>
                    </Link>
                  );
                }

                return (
                  <Link key={r.id} href={`/classroom/${id}/message/${r.id}`}>
                    <div className="p-5 bg-content2 rounded-2xl cursor-pointer">
                      <div className="flex items-center">
                        <User
                          size="lg"
                          avatarProps={{
                            src: r.image,
                            alt: r.name,
                          }}
                          name={r.name}
                          description={r.role}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {newRecipients.length !== 0 && (
          <section className="p-5 rounded-2xl border-2 border-dotted border-content2 mt-5">
            <h2 className="text-lg font-semibold mb-2">Start a new conversation</h2>
            <div className="grid grid-cols-5 gap-4">
              {newRecipients.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleStartChat(r.id)}
                  className="bg-content2 rounded-2xl cursor-pointer"
                >
                  <div className="p-5 bg-content2 rounded-2xl cursor-pointer">
                    <div className="flex items-center">
                      <User
                        size="lg"
                        avatarProps={{
                          src: r.image,
                          alt: r.name,
                        }}
                        name={r.name}
                        description={r.role}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </ClassroomLayout>
    </>
  );
}
