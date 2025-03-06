"use client";
import React from "react";
import moment from "moment";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Tooltip, User } from "@heroui/react";
import ClassroomLayout from "../layout/layout";
import { useSubscription } from "@apollo/client";
import { HeaderSlot } from "@components/layout/header";
import { SUB_GET_CLASSROOM, SUB_LIST_EXAM_GRADES } from "@graphql/subscriptions";

export default function ClassroomResultsMain({ id, session }) {
  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_GET_CLASSROOM, {
    variables: { id },
  });

  const {
    data: sub_data_exam_grades,
    loading: sub_loading_exam_grades,
    error: sub_error_exam_grades,
  } = useSubscription(SUB_LIST_EXAM_GRADES, {
    variables: { cid: id },
  });

  // Check if the current user is a member of the classroom
  const currentUser = sub_data?.classrooms_by_pk?.classroom_relation.find((cr) => cr.user.id === session.user.sub);

  return (
    <>
      <ClassroomLayout id={id} loading={sub_loading || sub_loading_exam_grades} classroom={sub_data?.classrooms_by_pk}>
        {sub_data_exam_grades?.exam_submissions.length > 0 ? (
          <div className="grid gap-4 grid-cols-3">
            {sub_data_exam_grades?.exam_submissions.map((grade) => {
              const marksObtained = grade?.markings?.reduce((acc, curr) => acc + parseInt(curr.marking), 0);
              const totalMarks = grade?.exam?.questions.reduce((acc, curr) => acc + parseInt(curr.points), 0);

              if (currentUser?.role === "student" && grade.status !== "published") return null;

              return (
                <Link href={`/classroom/${id}/exam/${grade.exam.id}/submission/${grade.id}`} key={grade.id}>
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
                      <div className="flex-auto flex flex-col">
                        <div className="flex-initial">
                          {grade.exam.title.length > 50 ? (
                            <Tooltip color="default" content={grade.exam.title} position="top">
                              <h2 className="text-base font-semibold font-exo">
                                {grade.exam.title.substring(0, 50) + "..."}
                              </h2>
                            </Tooltip>
                          ) : (
                            <h2 className="text-base font-semibold font-exo">{grade.exam.title}</h2>
                          )}
                        </div>
                        <div className="flex-initial">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Marks Obtained:{" "}
                            <span className="font-semibold text-primary-500">
                              {marksObtained}/{totalMarks}
                            </span>
                          </p>
                        </div>
                        <div className="flex-initial">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Published on:{" "}
                            <span className="font-semibold text-primary-500">
                              {moment(grade?.updated_at).format("DD MMM, YYYY hh:mm A")}
                            </span>
                          </p>
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
              <h1 className="text-2xl font-bold text-center">No Results found</h1>
            </div>
          </div>
        )}
      </ClassroomLayout>
    </>
  );
}
