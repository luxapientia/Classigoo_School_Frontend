"use client";
import React from "react";
import moment from "moment";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Tooltip, User } from "@heroui/react";
import ClassroomLayout from "../layout/layout";
import { useSubscription } from "@apollo/client";
import { HeaderSlot } from "@components/layout/header";
import {
  SUB_GET_CLASSROOM,
  SUB_LIST_ASSIGNMENTS,
} from "@graphql/subscriptions";

export default function ClassroomAssignmentsMain({ id, session }) {
  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_GET_CLASSROOM, {
    variables: { id },
  });

  const {
    data: sub_data_assignments,
    loading: sub_loading_assignments,
    error: sub_error_assignments,
  } = useSubscription(SUB_LIST_ASSIGNMENTS, {
    variables: { cid: id },
  });

  // Check if the current user is a member of the classroom
  const currentUser = sub_data?.classrooms_by_pk?.classroom_relation.find(
    (cr) => cr.user.id === session.user.sub
  );

  return (
    <>
      <ClassroomLayout
        id={id}
        loading={sub_loading || sub_loading_assignments}
        classroom={sub_data?.classrooms_by_pk}
      >
        {(currentUser?.role === "owner" || currentUser?.role === "teacher") && (
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
        )}

        {sub_data_assignments?.assignments.length > 0 ? (
          <div className="grid gap-4 grid-cols-1">
            {sub_data_assignments?.assignments.map((assignment) => (
              <Link
                href={`/classroom/${id}/assignment/${assignment.id}`}
                key={assignment.id}
                className="cursor-pointer"
              >
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
                        {assignment.title.length > 50 ? (
                          <Tooltip color="default" content={assignment.title}>
                            <h2 className="text-base font-semibold font-exo">
                              {assignment.title.substring(0, 50) + "..."}
                              {assignment.status === "draft" ? (
                                <span className="ml-2 text-[10px] bg-red-500 text-white px-1 rounded-lg">
                                  Draft
                                </span>
                              ) : (
                                <span className="ml-2 text-[10px] bg-green-500 text-white px-1 rounded-lg">
                                  Published
                                </span>
                              )}
                            </h2>
                          </Tooltip>
                        ) : (
                          <h2 className="text-base font-semibold font-exo">
                            {assignment.title}
                            {assignment.status === "draft" ? (
                              <span className="ml-2 text-[10px] bg-red-500 text-white px-1 rounded-lg">
                                Draft
                              </span>
                            ) : (
                              <span className="ml-2 text-[10px] bg-green-500 text-white px-1 rounded-lg">
                                Published
                              </span>
                            )}
                          </h2>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Last updated:{" "}
                          {moment(assignment.updated_at).format("MMM DD, YYYY")}
                        </p>
                        <p className="text-xs text-danger-500 dark:text-danger-400 mt-1">
                          Deadline:{" "}
                          {moment(assignment.deadline).format(
                            "DD MMM YYYY hh:mm A"
                          )}
                        </p>
                      </div>
                      <div className="flex-auto"></div>
                      <div className="flex-initial grid content-center justify-end">
                        <div className="flex justify-end">
                          <div className="border-2 border-dashed w-full px-2 py-1 grid justify-center content-center rounded-lg">
                            <User
                              className="text-xs"
                              avatarProps={{
                                src: assignment.owner.avatar,
                                size: "sm",
                                isBordered: true,
                              }}
                              description={
                                <h4 className="text-xs text-gray-500 dark:text-gray-400">
                                  {assignment.owner.email}
                                </h4>
                              }
                              name={assignment.owner.name}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-16">
            <div className="border-2 rounded-xl border-gray-500 h-48 border-dashed grid content-center justify-center">
              <h1 className="text-2xl font-bold text-center">
                No Assignments Yet
              </h1>
              <div className="mt-5 mx-auto">
                {/* if owner or teacher */}
                {currentUser?.role === "owner" ||
                currentUser?.role === "teacher" ? (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-center text-xs text-white">
                      <Link
                        href={`/classroom/${id}/assignment/create`}
                        className="bg-blue-500 px-5 py-2"
                      >
                        Create Assignment
                      </Link>
                    </p>
                  </div>
                ) : (
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    You will find assignments here when a teacher publishes an
                    assignment for this classroom.
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
