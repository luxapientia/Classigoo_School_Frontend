"use client";
import React from "react";
import axios from "@lib/axios";
import moment from "moment";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Alert, Tooltip, User } from "@heroui/react";
import ClassroomLayout from "../layout/layout";
import { useRouter } from "nextjs-toploader/app";
import { HeaderSlot } from "@components/layout/header";

// import { START_CHAT } from "@graphql/mutations";
// import { useSubscription, useMutation } from "@apollo/client";
// import { SUB_GET_CLASSROOM, SUB_LIST_MESSAGE_RECEIPIENTS } from "@graphql/subscriptions";
import Loading from "@components/common/loading";
import { useSocket } from "@hooks/useSocket";

export default function ClassroomMessagesMain({ id, userInfo }) {
  const router = useRouter();

  const [classroom, setClassroom] = React.useState(null);
  const [classroomLoading, setClassroomLoading] = React.useState(false);
  const [messageRecipients, setMessageRecipients] = React.useState([]);
  const [messageRecipientsLoading, setMessageRecipientsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [receipients, setReceipients] = React.useState([]);
  const [newRecipients, setNewRecipients] = React.useState([]);
  const [loadingNewConversation, setLoadingNewConversation] = React.useState(false);

  // const [startChat] = useMutation(START_CHAT);

  // const {
  //   data: sub_data,
  //   loading: sub_loading,
  //   error: sub_error,
  // } = useSubscription(SUB_GET_CLASSROOM, {
  //   variables: { id },
  // });

  // fetch classroom
  const fetchClassroom = React.useCallback(async () => {
    setClassroomLoading(true);
    try {
      const res = await axios.get(`/v1/classroom/${id}`);
      setClassroom(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load classroom");
    }

    setClassroomLoading(false);
  }, [id]);

  React.useEffect(() => {
    fetchClassroom();
  }, [fetchClassroom]);

  useSocket("classroom.updated", (payload) => {
    if (payload.data.id === id) {
      fetchClassroom();
    }
  });

  // const {
  //   data: sub_data_message_receipients,
  //   loading: sub_loading_message_receipients,
  //   error: sub_error_message_receipients,
  // } = useSubscription(SUB_LIST_MESSAGE_RECEIPIENTS, {
  //   variables: { cid: id },
  // });

  // fetch recipients
  const fetchMessageRecipients = React.useCallback(async () => {
    setMessageRecipientsLoading(true);
    try {
      const res = await axios.get(`/v1/classroom/message/recipients/${id}`);
      setMessageRecipients(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load message recipients");
    }

    setMessageRecipientsLoading(false);
  }, [id]);

  React.useEffect(() => {
    fetchMessageRecipients();
  }, [fetchMessageRecipients]);

  useSocket("classroom.member.updated", (payload) => {
    if (payload.data.id === id) {
      fetchMessageRecipients();
    }
  });

  // Check if the current user is a member of the classroom
  const currentUser = classroom?.classroom_relation.find((cr) => cr.user.id === userInfo._id);

  React.useEffect(() => {
    if (classroom && messageRecipients) {
      let r = [];
      let u = [];

      console.log(messageRecipients);

      // if type == all then name is Group Name but if single that case there will be 2 users in the array and name will be the name of other user in the array different from the current user
      messageRecipients.forEach((mr) => {
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
            name: mr?.users?.find((u) => u?.user?.id !== userInfo._id)?.user?.name,
            image: mr?.users?.find((u) => u?.user?.id !== userInfo._id)?.user?.avatar?.url,
            uid: mr?.users?.find((u) => u?.user?.id !== userInfo._id)?.user?.id,
            role:
              mr?.users?.find((u) => u?.user?.id !== userInfo._id)?.user?.role === "student"
                ? "Student"
                : "Teacher",
          });
        }
      });

      // get the users who are not in the receipients list
      classroom.classroom_relation.forEach((cr) => {
        if (cr.user.id !== userInfo._id) {
          if (!r.find((rr) => rr.uid === cr.user.id)) {
            u.push({
              id: cr.user.id,
              name: cr.user.name,
              image: cr.user.avatar.url,
              role: cr.role === "student" ? "Student" : "Teacher",
            });
          }
        }
      });

      setReceipients(r);
      setNewRecipients(u);
    }
  }, [messageRecipients, classroom]);

  const handleStartChat = async (uid) => {
    setLoadingNewConversation(true);
    try {
      // const res = await startChat({
      //   variables: {
      //     uid,
      //     cid: id,
      //   },
      // });

      const { data } = await axios.post(`/v1/classroom/message/start-chat`, {
        with_user: uid,
        classroom_id: id,
      });

      if (data.status === "success") {
        // redirect to the chat page
        router.push(`/classroom/${id}/message/${data.id}`);
      } else {
        setError(data.message);
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
        loading={classroomLoading || messageRecipientsLoading}
        classroom={classroom}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {receipients.map((r) => {
                if (r.type === "all") {
                  if (classroom?.child_only) {
                    return null;
                  }
                  return (
                    <Link key={r.id} href={`/classroom/${id}/message/${r.id}`}>
                      <div className="p-5 bg-content2 rounded-2xl cursor-pointer flex h-full">
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
                    <div className="p-5 bg-content2 rounded-2xl cursor-pointer h-full">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
