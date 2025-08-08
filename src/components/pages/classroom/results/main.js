"use client";
import React from "react";
import axios from "@lib/axios";
import moment from "moment";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Tooltip, User } from "@heroui/react";
import ClassroomLayout from "../layout/layout";
import { useSocket } from "@hooks/useSocket";
// import { useSubscription } from "@apollo/client";
import { HeaderSlot } from "@components/layout/header";
// import { SUB_GET_CLASSROOM, SUB_LIST_EXAM_GRADES } from "@graphql/subscriptions";

export default function ClassroomResultsMain({ id, userInfo }) {

  const [classroom, setClassroom] = React.useState(null);
  const [classroomLoading, setClassroomLoading] = React.useState(false);
  const [examGrades, setExamGrades] = React.useState([]);
  const [examGradesLoading, setExamGradesLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

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
  //   data: sub_data_exam_grades,
  //   loading: sub_loading_exam_grades,
  //   error: sub_error_exam_grades,
  // } = useSubscription(SUB_LIST_EXAM_GRADES, {
  //   variables: { cid: id },
  // });

  // fetch exam grades
  const fetchExamGrades = React.useCallback(async () => {
    setExamGradesLoading(true);
    try {
      const { data: res } = await axios.get(`/v1/classroom/exam/grades/${id}`);
      setExamGrades(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load exam grades");
    }
    setExamGradesLoading(false);
  }, [id]);
  
  React.useEffect(() => {
    fetchExamGrades();
  }, [fetchExamGrades]);

  // useSocket("exam.updated", (payload) => {
  //   if (payload.data.cid === id) {
  //     fetchExamGrades();
  //   }
  // });

  // Check if the current user is a member of the classroom
  const currentUser = classroom?.classroom_relation.find((cr) => cr.user.id === userInfo.id);

  return (
    <>
      <ClassroomLayout id={id} loading={classroomLoading || examGradesLoading} classroom={classroom}>
        {error && <p className="text-danger bg-danger/10 text-xs px-4 py-2 mt-2 w-full rounded-lg">{error}</p>}
        {examGrades.length > 0 ? (
          <div className="grid gap-4 grid-cols-3">
            {examGrades.map((grade) => {
              const marksObtained = grade?.markings?.reduce((acc, curr) => acc + parseInt(curr.marking), 0);
              const totalMarks = grade?.exam?.questions.reduce((acc, curr) => acc + parseInt(curr.points), 0);

              if (currentUser?.role === "parent" && grade.status !== "published") return null;

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
