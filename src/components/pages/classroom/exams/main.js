"use client";
import React from "react";
import axios from "@lib/axios";
import moment from "moment";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Tooltip, User } from "@heroui/react";
import ClassroomLayout from "../layout/layout";
// import { useSubscription } from "@apollo/client";
import { HeaderSlot } from "@components/layout/header";
// import { SUB_GET_CLASSROOM, SUB_LIST_EXAMS } from "@graphql/subscriptions";
import { useSocket } from "@hooks/useSocket";

export default function ClassroomExamsMain({ id, userInfo }) {

  const [classroom, setClassroom] = React.useState(null);
  const [classroomLoading, setClassroomLoading] = React.useState(false);
  const [exams, setExams] = React.useState([]);
  const [examsLoading, setExamsLoading] = React.useState(false);

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
  //   data: sub_data_exams,
  //   loading: sub_loading_exams,
  //   error: sub_error_exams,
  // } = useSubscription(SUB_LIST_EXAMS, {
  //   variables: { cid: id },
  // });

  //fetch assignments
  const fetchExams = React.useCallback(async () => {
    setExamsLoading(true);
    try {
      const { data: res } = await axios.get(`/v1/classroom/exam/list/${id}`);
      setExams(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load exams");
    }

    setExamsLoading(false);
  }, [id]);

  React.useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  useSocket("exam.updated", (payload) => {
    if (payload.data.cid === id) {
      fetchExams();
    }
  });

  // Check if the current user is a member of the classroom
  const currentUser = classroom?.classroom_relation.find((cr) => cr.user._id === userInfo._id);

  return (
    <>
      <ClassroomLayout id={id} loading={classroomLoading || examsLoading} classroom={classroom}>
        {(currentUser?.role === "owner" || currentUser?.role === "teacher") && (
          <HeaderSlot>
            <Link
              href={`/classroom/${id}/exam/create`}
              className="hidden md:flex items-center bg-content2 text:content1 px-4 py-2 border-2 rounded-xl"
            >
              <Icon icon="akar-icons:plus" />
              <span className="ml-1">Create Exam</span>
            </Link>
            <Link
              href={`/classroom/${id}/exam/create`}
              className="grid md:hidden justify-center items-center h-[44px] w-[44px] rounded-full px-0 bg-blue-500 text-white shadow-[0px_0px_5px_1px_#3b82f6c7]"
            >
              <Icon icon="akar-icons:plus" />
            </Link>
          </HeaderSlot>
        )}

        {exams.length > 0 ? (
          <div className="grid gap-4 grid-cols-1">
            {exams.map((exam) => {
              if (currentUser?.role === "student" && exam.status === "draft") return null;
              if (
                currentUser?.role === "student" &&
                !exam?.audience?.includes("*") &&
                !exam?.audience?.includes(currentUser?.user._id)
              )
                return null;

              return (
                <Link href={`/classroom/${id}/exam/${exam.id}`} key={exam.id} className="cursor-pointer">
                  <div className="shadow rounded-xl p-5">
                    <div className="flex">
                      <div className="flex-initial pr-4">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-2 grid justify-center items-center h-16 w-16">
                          <Icon
                            icon="solar:airbuds-case-minimalistic-bold-duotone"
                            className="w-8 h-8 text-gray-500 dark:text-gray-200"
                          />
                        </div>
                      </div>
                      <div className="flex-auto flex">
                        <div className="flex-initial">
                          {exam.title.length > 50 ? (
                            <Tooltip color="default" content={exam.title} position="top">
                              <h2 className="text-base font-semibold font-exo">
                                {exam.title.substring(0, 50) + "..."}
                                {/* if start_once and startonce+duration has passed current time */}
                                {exam.start_once &&
                                moment().isAfter(moment(exam.start_once).add(exam.duration, "minutes")) ? (
                                  <span className="ml-2 text-[10px] bg-red-500 text-white px-1 rounded-lg">
                                    Times Up!
                                  </span>
                                ) : exam.status === "draft" ? (
                                  <span className="ml-2 text-[10px] bg-red-500 text-white px-1 rounded-lg">Draft</span>
                                ) : (
                                  <span className="ml-2 text-[10px] bg-green-500 text-white px-1 rounded-lg">
                                    Active
                                  </span>
                                )}
                              </h2>
                            </Tooltip>
                          ) : (
                            <h2 className="text-base font-semibold font-exo">
                              {exam.title}
                              {exam.start_once &&
                              moment().isAfter(moment(exam.start_once).add(exam.duration, "minutes")) ? (
                                <span className="ml-2 text-[10px] bg-red-500 text-white px-1 rounded-lg">Ended</span>
                              ) : exam.status === "draft" ? (
                                <span className="ml-2 text-[10px] bg-red-500 text-white px-1 rounded-lg">Draft</span>
                              ) : (
                                <span className="ml-2 text-[10px] bg-green-500 text-white px-1 rounded-lg">Active</span>
                              )}
                            </h2>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Last updated: {moment(exam.updated_at).format("MMM DD, YYYY")}
                          </p>
                          {exam.start_once && (
                            <p className="text-xs text-danger-500 dark:text-danger-400 mt-1">
                              Starts on: {moment(exam.start_once).format("MMM DD, YYYY hh:mm A")}
                            </p>
                          )}
                        </div>
                        <div className="flex-auto hidden lg:block"></div>
                        <div className="flex-initial hidden lg:grid content-center justify-end">
                          <div className="flex flex-col justify-center items-center">
                            <div className="border-2 border-dashed w-full px-2 py-1 grid justify-center content-center rounded-lg">
                              <User
                                className="text-xs"
                                avatarProps={{
                                  src: exam.owner.avatar.url,
                                  size: "sm",
                                  isBordered: true,
                                }}
                                description={
                                  <h4 className="text-xs text-gray-500 dark:text-gray-400">{exam.owner.email}</h4>
                                }
                                name={exam.owner.name}
                              />
                            </div>
                            {exam.duration !== 0 && exam.duration !== null && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Exam Duration: {exam.duration} minutes
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-16">
            <div className="border-2 rounded-xl border-gray-500 h-48 border-dashed grid content-center justify-center">
              <h1 className="text-2xl font-bold text-center">No exams found</h1>
              <div className="mt-5 mx-auto">
                {/* if owner or teacher */}
                {currentUser?.role === "owner" || currentUser?.role === "teacher" ? (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-center text-xs text-white">
                      <Link href={`/classroom/${id}/exam/create`} className="bg-blue-500 px-5 py-2">
                        Create Exam
                      </Link>
                    </p>
                  </div>
                ) : (
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    You will see the exams here once the teacher has created them.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </ClassroomLayout>
    </>
  );
}
